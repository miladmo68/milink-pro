#!/usr/bin/env node
// Viewport screenshots of the running site at chosen moments, for visual checks.
//
//   BASE_URL=http://localhost:3000 node scripts/shoot.mjs <outPrefix> <width> <height> <mobile 0|1> <ms,ms,...>
//
// Optional env:
//   EVAL="js"   run this JavaScript in the page ~4s after load (click things, scroll to a section)
//   RM=1        emulate prefers-reduced-motion
//   PRINT="js"   evaluate this JavaScript at the end and print its result (e.g. computed styles)
//   URL=...     full URL instead of BASE_URL + "/"
// Prints page width vs viewport width, so horizontal overflow is easy to spot.
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [prefix, w, h, mobile = "0", times = "5000"] = process.argv.slice(2);
if (!prefix || !w || !h) {
  console.error("Usage: node scripts/shoot.mjs <outPrefix> <width> <height> <mobile 0|1> <ms,ms,...>");
  process.exit(1);
}

const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const target_url = process.env.URL || `${process.env.BASE_URL || "http://localhost:3000"}/`;
const port = 9333 + Math.floor(Math.random() * 400);
const profile = mkdtempSync(join(tmpdir(), "milink-shoot-"));
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, "--hide-scrollbars", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let page;
for (let i = 0; i < 50 && !page; i++) {
  await sleep(200);
  try { page = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch { /* retry */ }
}
if (!page) { chrome.kill(); throw new Error("Could not reach Chrome. Set CHROME_PATH."); }

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve) => ws.addEventListener("open", resolve));
let id = 0;
const pending = new Map();
ws.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); }
});
const send = (method, params = {}) => new Promise((resolve) => { const n = ++id; pending.set(n, resolve); ws.send(JSON.stringify({ id: n, method, params })); });

await send("Emulation.setDeviceMetricsOverride", { width: +w, height: +h, deviceScaleFactor: 1, mobile: mobile === "1" });
if (mobile === "1") await send("Emulation.setTouchEmulationEnabled", { enabled: true });
await send("Page.enable");
if (process.env.RM) await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
const t0 = Date.now();
await send("Page.navigate", { url: target_url });
if (process.env.EVAL) { await sleep(4000); await send("Runtime.evaluate", { expression: process.env.EVAL }); }
for (const t of times.split(",").map(Number)) {
  await sleep(Math.max(0, t - (Date.now() - t0)));
  const shot = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`${prefix}-${t}.png`, Buffer.from(shot.data, "base64"));
}
const info = await send("Runtime.evaluate", { expression: "JSON.stringify({ pageWidth: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth })", returnByValue: true });
console.log(info.result.value);
if (process.env.PRINT) {
  const out = await send("Runtime.evaluate", { expression: process.env.PRINT, returnByValue: true, awaitPromise: true });
  console.log(typeof out.result?.value === "string" ? out.result.value : JSON.stringify(out.result?.value));
}
ws.close();
chrome.kill();

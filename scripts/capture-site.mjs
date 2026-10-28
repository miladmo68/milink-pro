#!/usr/bin/env node
// Full-page screenshot of a live site with headless Chrome (no dependencies).
// Used to refresh the captures in public/assets/work (see the work-showcase skill).
//
//   node scripts/capture-site.mjs <url> <out.jpg> [width=1440] [height=900] [mobile=0|1] [maxHeight=7000]
//
// It scrolls the page first so scroll-triggered reveals fire, then captures the
// whole page. Set CHROME_PATH if Chrome is not at the macOS default location.
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, out, w = "1440", h = "900", mobile = "0", cap = "7000"] = process.argv.slice(2);
if (!url || !out) {
  console.error("Usage: node scripts/capture-site.mjs <url> <out.jpg> [width] [height] [mobile] [maxHeight]");
  process.exit(1);
}

const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const port = 9700 + Math.floor(Math.random() * 250);
const profile = mkdtempSync(join(tmpdir(), "milink-capture-"));
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, "--hide-scrollbars", `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let target;
for (let i = 0; i < 60 && !target; i++) {
  await sleep(200);
  try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch { /* retry */ }
}
if (!target) { chrome.kill(); throw new Error("Could not reach Chrome. Set CHROME_PATH."); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve) => ws.addEventListener("open", resolve));
let id = 0;
const pending = new Map();
ws.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); }
});
const send = (method, params = {}) => new Promise((resolve) => { const n = ++id; pending.set(n, resolve); ws.send(JSON.stringify({ id: n, method, params })); });
const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.value;

await send("Emulation.setDeviceMetricsOverride", { width: +w, height: +h, deviceScaleFactor: 1, mobile: mobile === "1" });
if (mobile === "1") await send("Emulation.setTouchEmulationEnabled", { enabled: true });
await send("Page.enable");
await send("Page.navigate", { url });
await sleep(5000);

const total = Math.min(+cap, (await evaluate("document.documentElement.scrollHeight")) || +h);
for (let y = 0; y < total; y += Math.round(+h * 0.6)) {
  await evaluate(`window.scrollTo(0, ${y})`);
  await sleep(260);
}
await sleep(900);
await evaluate("window.scrollTo(0, 0)");
await sleep(1400);

const height = Math.min(+cap, (await evaluate("Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)")) || +h);
const shot = await send("Page.captureScreenshot", {
  format: "jpeg", quality: 88, captureBeyondViewport: true, fromSurface: true,
  clip: { x: 0, y: 0, width: +w, height, scale: 1 },
});
writeFileSync(out, Buffer.from(shot.data, "base64"));
console.log(`${out} ${w}x${height}`);
ws.close();
chrome.kill();

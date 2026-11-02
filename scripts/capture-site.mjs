#!/usr/bin/env node
// Full-page screenshot of a live site with headless Chrome (no dependencies).
// Used to refresh the captures in public/assets/work (see the work-showcase skill).
//
//   node scripts/capture-site.mjs <url> <out.jpg> [width=1440] [height=900] [mobile=0|1] [maxHeight=7000]
//
// It scrolls the page first so scroll-triggered reveals fire, then captures the
// whole page. Set CHROME_PATH if Chrome is not at the macOS default location.
// Set CAPTURE_PREP to a JS expression to adjust the page right before capturing,
// and CAPTURE_PATCH to CSS selectors of embeds that only paint on screen (maps).
import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
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
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, "--hide-scrollbars", "--disable-features=IsolateOrigins,site-per-process", `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });

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
// Optional site-specific JS run just before the capture, e.g. to collapse a
// scroll-pinned section that would otherwise show as a tall empty band.
if (process.env.CAPTURE_PREP) { await evaluate(process.env.CAPTURE_PREP); await sleep(900); }

const height = Math.min(+cap, (await evaluate("Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)")) || +h);

// Some embeds (Google Maps, video players) only paint inside the viewport, so
// they come out blank in a full-page capture. CAPTURE_PATCH="sel1, sel2" shoots
// each matching element while it is on screen (before the full-page shot, which
// leaves such iframes unpainted) and pastes it in with ffmpeg afterwards.
const patches = [];
if (process.env.CAPTURE_PATCH) {
  const rects = await evaluate(`[...document.querySelectorAll(${JSON.stringify(process.env.CAPTURE_PATCH)})].map((el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left + scrollX), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) };
  }).filter((r) => r.w && r.h && r.y + r.h <= ${height})`);
  for (const [i, r] of (rects || []).entries()) {
    await evaluate(`window.scrollTo(0, ${Math.max(0, r.y - Math.round((+h - r.h) / 2))})`);
    await sleep(5000);
    // Clip coordinates are document coordinates.
    const part = await send("Page.captureScreenshot", { format: "png", clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale: 1 } });
    const file = `${out}.patch-${i}.png`;
    writeFileSync(file, Buffer.from(part.data, "base64"));
    patches.push({ ...r, file });
  }
  await evaluate("window.scrollTo(0, 0)");
  await sleep(1400);
}

const shot = await send("Page.captureScreenshot", {
  format: "jpeg", quality: 88, captureBeyondViewport: true, fromSurface: true,
  clip: { x: 0, y: 0, width: +w, height, scale: 1 },
});
writeFileSync(out, Buffer.from(shot.data, "base64"));
console.log(`${out} ${w}x${height}`);
for (const r of patches) {
  const ff = spawnSync("ffmpeg", ["-loglevel", "error", "-y", "-i", out, "-i", r.file, "-filter_complex", `overlay=${r.x}:${r.y}`, "-q:v", "2", `${out}.tmp.jpg`]);
  if (ff.status === 0) { renameSync(`${out}.tmp.jpg`, out); unlinkSync(r.file); console.log(`patched ${r.w}x${r.h} at ${r.x},${r.y}`); }
  else console.log(`ffmpeg missing or failed; patch left at ${r.file} (paste at ${r.x},${r.y})`);
}
ws.close();
chrome.kill();

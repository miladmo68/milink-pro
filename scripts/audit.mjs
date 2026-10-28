#!/usr/bin/env node
// Whole-page visual audit of the marketing site in one load.
//
//   BASE_URL=http://localhost:3200 node scripts/audit.mjs <outDir> <width> <height> <mobile 0|1> <dark|light> [RM=1]
//
// Scrolls through the home page, screenshots every section (several frames for
// tall ones) into <outDir>/<NN>-<section>-<i>.png, and prints console errors,
// failed requests, broken images, unnamed buttons/links, horizontal overflow.
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [outDir, w, h, mobile = "0", theme = "dark"] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const url = `${process.env.BASE_URL || "http://localhost:3000"}/`;
const port = 9333 + Math.floor(Math.random() * 400);
const profile = mkdtempSync(join(tmpdir(), "milink-audit-"));
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, "--hide-scrollbars", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let page;
for (let i = 0; i < 50 && !page; i++) { await sleep(200); try { page = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch { /* retry */ } }
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pending = new Map(); const problems = [];
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); return; }
  if (m.method === "Runtime.exceptionThrown") problems.push("exception: " + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).slice(0, 200));
  if (m.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(m.params.type)) problems.push(`console.${m.params.type}: ` + m.params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 200));
  if (m.method === "Network.responseReceived" && m.params.response.status >= 400) problems.push(`http ${m.params.response.status}: ${m.params.response.url}`);
  if (m.method === "Network.loadingFailed" && !m.params.canceled) problems.push(`failed: ${m.params.errorText} ${m.params.requestId}`);
});
const send = (method, params = {}) => new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
const ev = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.value;

await send("Emulation.setDeviceMetricsOverride", { width: +w, height: +h, deviceScaleFactor: 1, mobile: mobile === "1" });
if (mobile === "1") await send("Emulation.setTouchEmulationEnabled", { enabled: true });
await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
if (process.env.RM) await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await send("Page.navigate", { url });
await sleep(5000);
await ev("document.documentElement.style.scrollBehavior='auto'");
// Scroll the whole page once so lazy sections hydrate and images load.
const total = await ev("document.documentElement.scrollHeight");
for (let y = 0; y < total + 2000; y += +h * 0.7) { await ev(`window.scrollTo(0, ${y})`); await sleep(350); }
await sleep(1500);
if (theme === "light") await ev("document.documentElement.setAttribute('data-theme','light');document.documentElement.classList.remove('dark')");
await ev("window.scrollTo(0,0)"); await sleep(800);

const sections = [["navbar+hero", "#home,#hero", 3], ["services", "#services", 4], ["work", "#work", 4], ["process", "#process", 4], ["pricing", "#pricing", 4], ["testimonials", "#testimonials", 2], ["faq", "#faq", 2], ["contact", "#contact", 3]];
let n = 0;
for (const [name, sel, max] of sections) {
  const box = await ev(`(()=>{const e=document.querySelector(${JSON.stringify(sel)});if(!e)return null;const r=e.getBoundingClientRect();return {top:r.top+scrollY,h:r.height}})()`);
  if (!box) { problems.push(`missing section ${name} (${sel})`); continue; }
  const frames = Math.min(max, Math.max(1, Math.ceil(box.h / (+h - 100))));
  for (let i = 0; i < frames; i++) {
    const y = name === "navbar+hero" ? 0 : box.top - 80 + i * (+h - 120);
    await ev(`window.scrollTo(0, ${Math.max(0, y)})`); await sleep(1400);
    const shot = await send("Page.captureScreenshot", { format: "png" });
    writeFileSync(join(outDir, `${String(++n).padStart(2, "0")}-${name}-${i}.png`), Buffer.from(shot.data, "base64"));
    if (name === "navbar+hero") break;
  }
}
await ev("window.scrollTo(0, document.documentElement.scrollHeight)"); await sleep(1400);
writeFileSync(join(outDir, `${String(++n).padStart(2, "0")}-footer-0.png`), Buffer.from((await send("Page.captureScreenshot", { format: "png" })).data, "base64"));

const report = await ev(`JSON.stringify({
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  brokenImages: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.src && !i.src.startsWith('data:')).map(i => i.src).slice(0, 8),
  imagesNoAlt: [...document.images].filter(i => !i.hasAttribute('alt')).map(i => i.src).slice(0, 8),
  unnamed: [...document.querySelectorAll('a[href],button')].filter(e => !(e.textContent.trim() || e.getAttribute('aria-label') || e.getAttribute('title') || e.querySelector('img[alt]:not([alt=""])'))).map(e => e.outerHTML.slice(0, 120)).slice(0, 8),
  badCursor: [...document.querySelectorAll('a[href],button:not(:disabled),[role=button],[role=tab],summary')].filter(e => e.offsetParent && getComputedStyle(e).cursor !== 'pointer').map(e => (e.className||e.tagName).toString().slice(0, 60)).slice(0, 10),
  h1: document.querySelectorAll('h1').length,
  title: document.title,
  headings: [...document.querySelectorAll('h2')].map(e => e.textContent.trim().slice(0, 40)),
})`);
console.log(report);
console.log("problems:", JSON.stringify([...new Set(problems)].slice(0, 30), null, 1));
ws.close(); chrome.kill();

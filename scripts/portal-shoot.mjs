#!/usr/bin/env node
// Logs into the client portal or admin with a TEST account (from the gitignored
// .env.test.local), then screenshots a list of pages and reports console
// errors, failed requests and the first headings of each page.
//
//   ACT="js" runs on every page before its screenshot (for example to click a button).
//   PRINT="js" evaluates JavaScript on the last page and prints it.
//   BASE_URL=http://localhost:3200 node scripts/portal-shoot.mjs <outDir> <width> <height> <mobile 0|1> <client|admin> "<path,path,...>" [light]
//
//   Each page prints "offscreen": elements that stick out past the right edge (outside scrollable areas).
// Example paths: "/portal,/portal?tab=messages,/portal?tab=assets" or "/admin,/admin?tab=payments"
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [outDir, w, h, mobile = "0", role = "client", pathsArg = "", theme = "dark"] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const env = Object.fromEntries(readFileSync(new URL("../.env.test.local", import.meta.url), "utf8").split("\n").filter((l) => l.includes("=") && !l.startsWith("#")).map((l) => { const i = l.indexOf("="); return [l.slice(0, i), l.slice(i + 1)]; }));
const email = env[`TEST_${role.toUpperCase()}_EMAIL`], password = env[`TEST_${role.toUpperCase()}_PASSWORD`];
const base = process.env.BASE_URL || "http://localhost:3200";
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const port = 9333 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, "--hide-scrollbars", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", `--user-data-dir=${mkdtempSync(join(tmpdir(), "milink-portal-"))}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let page;
for (let i = 0; i < 50 && !page; i++) { await sleep(200); try { page = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch { /* retry */ } }
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pending = new Map(); const problems = [];
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); return; }
  if (m.method === "Runtime.exceptionThrown") problems.push("exception: " + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).slice(0, 220));
  if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") problems.push("console.error: " + m.params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 220));
  if (m.method === "Network.responseReceived" && m.params.response.status >= 400) problems.push(`http ${m.params.response.status}: ${m.params.response.url.replace(/\?.*/, "").slice(0, 140)}`);
});
const send = (method, params = {}) => new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
const ev = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.value;
await send("Emulation.setDeviceMetricsOverride", { width: +w, height: +h, deviceScaleFactor: 1, mobile: mobile === "1" });
if (mobile === "1") await send("Emulation.setTouchEmulationEnabled", { enabled: true });
await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");

const shot = async (name) => writeFileSync(join(outDir, `${name}.png`), Buffer.from((await send("Page.captureScreenshot", { format: "png" })).data, "base64"));
const loginPath = role === "admin" ? "/admin" : "/portal";
await send("Page.navigate", { url: base + loginPath }); await sleep(5000);
await shot("00-login");
const filled = await ev(`(()=>{const set=(el,v)=>{const s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;s.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}))};
 const inputs=[...document.querySelectorAll('input')].filter(i=>i.offsetParent);const em=inputs.find(i=>/email/i.test(i.type+i.name+i.autocomplete+i.placeholder))||inputs[0];const pw=inputs.find(i=>i.type==='password');
 if(!em||!pw)return 'no-form:'+inputs.length;set(em,${JSON.stringify(email)});set(pw,${JSON.stringify(password)});
 const btn=[...document.querySelectorAll('button')].find(b=>/^sign in$/i.test(b.textContent.trim())&&b.type!=='button')||[...document.querySelectorAll('button[type=submit],form button')].find(b=>/sign in/i.test(b.textContent));if(!btn)return 'no-button';btn.click();return 'submitted'})()`);
console.log("login:", filled);
await sleep(7000);
await ev(`localStorage.setItem("milink-dash-light","${theme === "light" ? "1" : "0"}")`);
for (const [i, path] of pathsArg.split(",").filter(Boolean).entries()) {
  { await send("Page.navigate", { url: base + path }); await sleep(6000); }
  if (process.env.ACT) { await ev(process.env.ACT); await sleep(1500); }
  await shot(`${String(i + 1).padStart(2, "0")}-${path.replace(/[^a-z0-9]+/gi, "_").slice(0, 40)}`);
  const info = await ev(`JSON.stringify({url:location.pathname+location.search,h1:[...document.querySelectorAll('h1')].map(e=>e.textContent.trim().slice(0,50)),overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,offscreen:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();if(!r.width||r.right<=innerWidth+1)return false;for(let a=e.parentElement;a;a=a.parentElement){const o=getComputedStyle(a).overflowX;if(o==='auto'||o==='scroll'||o==='hidden')return false;}return true;}).slice(0,3).map(e=>e.tagName+'.'+String(e.className).slice(0,40)),hasLoginForm:!!document.querySelector('input[type=password]')})`);
  console.log(info);
}
if (process.env.PRINT) console.log("print:", await ev(process.env.PRINT));
console.log("problems:", JSON.stringify([...new Set(problems)].slice(0, 25), null, 1));
ws.close(); chrome.kill();

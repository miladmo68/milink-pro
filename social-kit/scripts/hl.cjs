const { chromium } = require('playwright');
const keys=process.argv.slice(2);
(async()=>{const b=await chromium.launch();
for(const k of keys){const cov=k.startsWith('cover-');const p=await b.newPage({viewport:{width:1080,height:cov?1080:1920},deviceScaleFactor:2});
await p.goto('http://localhost:8811/_reel/hl.html?k='+k,{waitUntil:'networkidle'});await p.waitForTimeout(700);await p.screenshot({path:`/home/claude/out/hl/${k}@2x.png`});await p.close();}
await b.close();})();

const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:2});
for(let i=1;i<=6;i++){await p.goto('http://localhost:8811/_reel/carousel2.html?s='+i,{waitUntil:'networkidle'});await p.waitForTimeout(1200);await p.screenshot({path:`/home/claude/out/car-${i}@2x.png`});}
await b.close();})();

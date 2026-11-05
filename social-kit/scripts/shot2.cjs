const { chromium } = require('playwright');
(async()=>{const [url,out,w,h]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:+w,height:+h},deviceScaleFactor:2});await p.goto(url,{waitUntil:'networkidle'});await p.waitForTimeout(1200);await p.screenshot({path:out,type:'png'});await b.close();})();

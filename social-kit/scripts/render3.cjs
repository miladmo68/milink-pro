const { chromium } = require('playwright');
(async () => {
  const [url, out, dur, fps] = [process.argv[2], process.argv[3], +process.argv[4], +process.argv[5]];
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 });
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);
  const n = Math.round(dur * fps);
  for (let i = +(process.argv[6]||0); i < n; i++) {
    await p.evaluate(t => window.setT(t), i / fps);
    await p.waitForTimeout(20);
    await p.screenshot({ path: `${out}/f${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 100 });
  }
  await b.close();
})();

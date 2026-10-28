---
name: perf-check
description: Measure MiLink's real performance with Lighthouse (mobile and desktop) against a production build or the live site, and interpret the result without being fooled by noise. Use before and after any change that adds JS, images, fonts, or animation to the marketing site.
---

# Performance check

Targets (the Hero advertises "95+ Lighthouse", so keep it true): **desktop 100, mobile >= 90 locally, >= 95 on the live site; TBT < 100 ms; CLS < 0.02.**

## Procedure

1. **Quiet the machine.** Kill stale servers and headless Chromes first. A stale `next dev` or leftover Chrome inflates TBT massively (it once produced a false mobile score of 58 for a site that really scores 90+):
   ```bash
   pkill -f "next dev"; pkill -f "next start"; pkill -f next-server; pkill -f remote-debugging-port
   ```
2. **Clean production build** (never test `next dev`, and never run `npm run build` while a dev server is running; they share `.next`):
   ```bash
   rm -rf .next && npm run build && (npx next start -p 3200 &) && sleep 6
   ```
3. **Run Lighthouse 2-3 times** and compare, never trust one run:
   ```bash
   export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
   npx -y lighthouse@12 http://localhost:3200/ --quiet --chrome-flags="--headless=new" \
     --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=/tmp/lh-mobile.json
   npx -y lighthouse@12 http://localhost:3200/ --quiet --preset=desktop --chrome-flags="--headless=new" \
     --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=/tmp/lh-desktop.json
   ```
4. **Read the numbers** from the JSON (`categories.*.score`, `audits["total-blocking-time"]`, `audits["largest-contentful-paint"]`, `audits["metrics"].details.items[0]` for `observed*` values).
5. **Compare with the live site**: `npx -y lighthouse@12 https://milink.ca/ ...`. Live runs use the real CDN and are the honest baseline.

## Interpreting

- Mobile LCP in a local run is a **simulation** (4G + 4x CPU). Compare it to `observedLargestContentfulPaint`; if observed is small and TBT is ~0, the simulated LCP is a modelling artifact.
- A long task attributed to `chunks/<n>.js` that contains `hydrateRoot` is React hydration (react-dom). Fix by splitting work (below-fold sections are `dynamic()` imports in `src/app/page.jsx`), not by editing that chunk.
- LCP elements seen so far: the Hero stage image (priority, quality 60) and the navbar logo. Keep the Hero image small (`public/assets/work/*-cover.jpg`, about 60 KB).
- Fonts: Syne + DM Sans are preloaded; Bricolage is `preload: false` (Services titles only). Do not add font families without checking the byte cost.

## Do not

- Do not add a heavy library (3D, charts, animation) to the marketing bundle without measuring first.
- Do not re-add background video or large PNG/JPG sources to `public/` (the 82 MB of unused media was removed on purpose).

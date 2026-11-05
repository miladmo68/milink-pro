# Milink social kit (Instagram @milink.ca)

Not part of the website build. Tools and templates used to produce the weekly Instagram package.

## Set up a render workspace
```bash
mkdir -p /tmp/stage/_reel && cd /tmp/stage/_reel
cp ~/milink-pro/social-kit/templates/*.html ~/milink-pro/social-kit/assets/* .
cp ~/milink-pro/public/assets/work/*.jpg .          # real client site screenshots (<slug>-desktop.jpg, <slug>-mobile.jpg)
cd /tmp/stage && (python3 -m http.server 8811 >/dev/null 2>&1 &)   # templates load at http://localhost:8811/_reel/<file>.html
npm i -g playwright && npx playwright install chromium   # if missing
```
Scripts in `scripts/` have hard-coded output paths; edit them or copy the pattern.

## Templates
- `hl.html?k=...` — stories 1080x1920 and covers 1080x1080 (`cover-<name>`, `card-<name>`, `start-1..4`, `review-1..7`, `faq-1..5`, `work-1..7`). Navy/blue "blueprint" look.
- `carousel2.html?s=1..6` — 1080x1350 carousel with laptop/phone mockups of real client sites.
- `reel7.html?v=a|b` — 16 s Reel "7 websites" (exposes `window.setT(t)` for frame rendering).
- `stage.html`, `story1.html`, `bf-teaser.html` — earlier Reel/story/Black Friday designs.
Make NEW designs each week (different palette, layout, type) — reuse only the pipeline, not the look.

## Quality pipeline (always)
- Render at deviceScaleFactor 2, then Lanczos downscale: posts 1080x1350, stories/Reels 1080x1920, covers 1080x1080.
- JPEG quality 97, subsampling 0 (PIL `save(..., quality=97, subsampling=0)`).
- Video: render frames with `scripts/render2.cjs <url> <outdir> <seconds> 30` (render3.cjs resumes from a frame index), then
  `ffmpeg -framerate 30 -i f%04d.jpg -i music.wav -vf "scale=1080:1920:flags=lanczos,format=yuv420p" -c:v libx264 -profile:v high -preset slow -crf 15 -c:a aac -b:a 256k -shortest -movflags +faststart out.mp4`
- Music: original, generated with numpy (no copyrighted tracks).

## Content rules (from the owner)
- Never film or show the owner. Use real site screenshots, device mockups, motion graphics.
- Never invent social proof (no fake ratings/stars/numbers). Testimonials only verbatim from `src/data/content.js`.
- Logo: real blue Milink logo, transparent, unmodified.
- Every piece looks different (colours, layout); rich computer/web-design imagery, never plain text slides.
- Weekly mix: 2 posts (Mon & Fri 4:30 PM), 1 Reel (Wed 5 PM), 1 Trial Reel (Sat 4 PM), 5 stories (Tue 1 + Thu 1 + Sun 3-story related series, 8 PM). Nothing in the morning. Max 1 story/day except a related series.
- Highlight covers are never posted as stories.

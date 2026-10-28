---
name: work-showcase
description: Add a project to the MiLink Work section, change its link, or refresh its full-page captures. Use whenever a portfolio project is added, renamed, re-linked, or its live site changes.
---

# Work showcase: add or refresh a project

The Work section (`src/sections/Work.jsx`) renders every entry of `work` in `src/data/content.js`. Each project shows **full-page captures of its live site** (desktop and mobile) scrolling inside a browser/phone frame, plus a full-screen viewer. Captures are point-in-time images, so they must be re-shot when a site changes.

## Data shape (`src/data/content.js`)

```js
{
  id: "p8", slug: "my-project", title: "My Project",
  summary: "One honest sentence about the site.",
  tags: ["Web design", "Development", "Industry"],   // read from the live site, never invented
  tint: [r, g, b],                                    // accent for the glow/active row
  liveUrl: "https://example.com/",
  shots: { desktop: shot("my-project", "desktop", 1200, H), mobile: shot("my-project", "mobile", 390, H2) },
}
```

## Steps

1. **Confirm the site is up**: `curl -s -o /dev/null -w "%{http_code}" -L <url>` must be 200.
2. **Capture** (needs Chrome; set `CHROME_PATH` if it is not the macOS default):
   ```bash
   node scripts/capture-site.mjs <url> /tmp/p-d.jpg 1440 900 0 7000
   node scripts/capture-site.mjs <url> /tmp/p-m.jpg 390 844 1 9000
   ```
3. **Optimize into the repo** (ffmpeg): desktop is scaled to 1200px wide, mobile stays 390px.
   ```bash
   ffmpeg -y -i /tmp/p-d.jpg -vf "scale=1200:-2" -q:v 5 public/assets/work/<slug>-desktop.jpg
   ffmpeg -y -i /tmp/p-m.jpg -q:v 4 public/assets/work/<slug>-mobile.jpg
   sips -g pixelHeight public/assets/work/<slug>-*.jpg     # the heights go into content.js
   ```
4. **Hero covers**: the Hero uses a 1200x675 crop of the first four projects: `ffmpeg -y -i public/assets/work/<slug>-desktop.jpg -vf "crop=1200:675:0:0" -q:v 4 public/assets/work/<slug>-cover.jpg`. Only needed if the project appears in `SCENES` in `Hero.jsx`.
5. **Edit `content.js`** (heights from step 3). Keep the `tags` honest and read from the site.
6. **Verify**: run the site and use the `visual-check` skill (scroll to `#work`, open the viewer, toggle Desktop/Mobile, check 390px width and no horizontal overflow).
7. **Update `PROJECT_CONTEXT.md`** (Work v2 entry and the change log).

## Rules and pitfalls

- Budget: roughly 300-500 KB per capture. Never commit raw PNGs.
- Cookie banners or chat widgets get captured; if one dominates, re-capture later or crop.
- Captures cap at 7000px (desktop) and 9000px (mobile); long pages are intentionally truncated.
- Never claim results (rankings, revenue, "50+ projects") in a project summary unless the owner confirms them.

---
name: visual-check
description: Verify a visual or interactive change on the running MiLink site with headless-Chrome screenshots (desktop, mobile, light/dark, reduced motion, interactions). Use after any UI change, before reporting it done.
---

# Visual check

Tool: `scripts/shoot.mjs` (no dependencies; needs Chrome, set `CHROME_PATH` if not on macOS default).

```bash
BASE_URL=http://localhost:3000 node scripts/shoot.mjs /tmp/shot 1440 900 0 6000        # desktop, one frame at 6s
BASE_URL=http://localhost:3000 node scripts/shoot.mjs /tmp/shot-m 390 844 1 6000        # mobile emulation
EVAL="document.getElementById('work').scrollIntoView()" BASE_URL=... node scripts/shoot.mjs /tmp/work 1440 900 0 12000
RM=1 BASE_URL=... node scripts/shoot.mjs /tmp/still 1440 900 0 6000                     # prefers-reduced-motion
```

`PRINT="js"` evaluates JavaScript at the end and prints the result: use it to measure instead of guessing (for example, count clickable elements whose `getComputedStyle(el).cursor` is not `pointer`, or read bounding boxes to check centring).

It prints `pageWidth` vs `viewport`; they must be equal (no horizontal overflow). Then **look at the PNGs** (Read tool).

## What to cover

- Desktop 1440x900 and a short laptop 1280x720, mobile 390x844.
- Light theme: `EVAL="document.documentElement.setAttribute('data-theme','light');document.documentElement.classList.remove('dark')"`.
- The interaction itself (open the viewer, submit the form with `EVAL`, click a chip) and its error/empty states.
- Reduced motion (`RM=1`): content must still be complete and static.

## Gotchas

- First `next/image` request in dev is slow (no `sharp`); warm it with a `curl` to `/_next/image?...` or wait 12-15 s before the frame.
- Headless Chrome runs WebGL in software and at a low frame rate. Judge layout, colour and state there, not animation smoothness.
- Use a **production build** for anything that measures performance (`perf-check`), `next dev` for iteration.
- Never run `npm run build` while `next dev` is running (shared `.next` gets corrupted: "Cannot find module ./vendor-chunks/...").
- Kill leftovers: `pkill -f "next dev"; pkill -f "next start"; pkill -f next-server; pkill -f remote-debugging-port`.

---
name: marketing-change
description: Checklist for any change to the public marketing site (Hero, Services, Work, Pricing, Testimonials, FAQ, Contact, Navbar, Footer). Use before and after editing those files, so the site stays consistent, light, and documented.
---

# Marketing change checklist

Read `PROJECT_CONTEXT.md` section 1 first. Marketing is frozen by default; work only when the owner asks for it, and record each authorization in the context file.

## Build with the shared pieces (do not re-invent)

| Need | Use | Where |
| --- | --- | --- |
| Any CTA or button | `<Button>` (variants primary/secondary; sizes default/compact/block; `href`, `external`, `arrow`) | `src/components/ui/Button.jsx` |
| Any form control | `<Field>` (input/textarea/select, label, hint, error) and `.mk-*` styles | `src/components/ui/Field.jsx` |
| Phone, email, Instagram, address, WhatsApp, portfolio URL | `BUSINESS`, `mapsUrl()`, `whatsappLinks()` | `src/config/business.js` |
| WhatsApp click on phones | `openWhatsApp` | `src/lib/whatsapp.js` |
| Copy, prices, services, projects, FAQ | `src/data/content.js` (single source; also feeds schema) | `src/data/content.js` |
| Scroll reveal | `<Reveal>` | `src/components/scroll-reveal.jsx` |

Never type a phone number, handle, URL or price into a component. Hero (magnetic CTAs) and Navbar still use `marketing-cta` classes directly; new code uses `Button`.

## Always check before finishing

1. Light and dark theme, desktop and 390px mobile, `prefers-reduced-motion` (see `visual-check`).
2. No horizontal overflow at 390px.
3. Anything clickable shows the pointer cursor (one global rule in `globals.css` covers links, buttons, `role=button/tab/radio`, `aria-pressed`, `summary`, `select`, radio/checkbox and their labels, plus `.work-viewer`, which is portalled outside `.marketing-site`). If you portal something new to `<body>`, add its root class to that rule. Verify with `PRINT` in `scripts/shoot.mjs`.
3b. Keyboard: focus ring visible, Esc/Enter/Space work, accessible names contain their visible text.
4. Heavy work stays lazy: below-fold sections are `dynamic()` imports in `src/app/page.jsx`; animation pauses off-screen and in hidden tabs.
5. `npm run build` passes; run `perf-check` if you added JS, images, fonts or animation.
6. **Update `PROJECT_CONTEXT.md`** (feature entry plus change-log line) in the same change.
7. Commit and push to `main` only when the owner asks. No feature branches unless asked.

## Content integrity (hard rules)

- No invented testimonials, ratings, client logos, project counts, or results. If a number is not verified by the owner, it does not ship. `testimonials` in `content.js` are the seven client-approved quotes (no star ratings are shown, because none were given). Change them only with the client's approval.
- Project tags and summaries describe what the live site visibly is.

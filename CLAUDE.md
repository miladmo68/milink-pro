# MiLink — instructions for AI sessions

**Read [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) first.** It is the single source of truth: what the product does, the architecture, the shared UI/config pieces, performance baselines, known issues, and a dated change log. **Update it in the same change as every piece of work** (feature entry, change-log line, shared-piece table if it changed). The owner relies on it to resume from any point.

## Quick orientation

- Next.js 14 App Router, React 18, Tailwind + DaisyUI, Framer Motion, Supabase, Stripe, Nodemailer. JavaScript (`.jsx`), no TypeScript.
- Two products in one repo: the **public marketing site** (`src/sections`, `src/components`, `src/app/page.jsx`) and the **client/admin dashboard** (`src/components/portal`, `/portal`, `/admin`). They have separate ownership rules in `PROJECT_CONTEXT.md` section 1.
- The owner (Milad) writes in **Persian**: reply in Persian; keep code, comments and commit messages in English.

## Rules that always apply

1. Marketing files change only when the owner asks. Record each authorization in `PROJECT_CONTEXT.md`.
2. Use the shared pieces (`src/config/business.js`, `Button`, `Field`, `content.js`, `Reveal`); never hard-code a phone, URL, price or hand-roll a button/field.
3. **Never ship invented social proof**: testimonials, ratings, logos, project counts, results. The current `testimonials` are unverified placeholders (see known issues, section 12).
4. Keep the site light: lazy below-fold sections, no new heavy libraries or large media without running the `perf-check` skill.
5. Verify visually (desktop, mobile 390px, light/dark, reduced motion) and run `npm run build` before reporting done. Say plainly what was and was not verified.
6. Commit and push **straight to `main`, only when asked**. No feature branches unless requested. A push to `main` deploys to production on Vercel.
7. Secrets live only in environment variables (`.env.local` is never committed).

## Skills (`.claude/skills/`)

`marketing-change` · `work-showcase` · `perf-check` · `contact-form` · `visual-check`. Helper scripts are in `scripts/`.

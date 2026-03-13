# MILINK — Next.js

Web Design, E-Commerce Solutions, SEO, UI/UX & Branding (Toronto). Built with **Next.js 14** (App Router), Tailwind CSS, DaisyUI, and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build for production

```bash
npm run build
npm start
```

## Environment variables (contact form)

Create `.env.local` and set:

- `SMTP_HOST` — SMTP server
- `SMTP_PORT` — e.g. 465
- `SMTP_USER` — SMTP user
- `SMTP_PASS` — SMTP password
- `TO_EMAIL` — Inbox for form submissions

## SEO

- Metadata and Open Graph in `src/app/layout.jsx`
- JSON-LD (Organization, WebSite, WebPage, ProfessionalService) in layout
- Canonical URL, robots, and viewport themeColor configured

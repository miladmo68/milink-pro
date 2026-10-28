---
name: contact-form
description: How the MiLink contact form and /api/contact work (spam protection, validation, email, thank-you state), and how to test them without sending real email. Use when changing the form, the API route, or anti-spam settings.
---

# Contact form and `/api/contact`

**Client** (`src/sections/Contact.jsx`): built from `Field` and `Button`; fields are name, email, phone (optional), package (optional, preselected by `?package=`), message. It sends `openedAt` (when the form mounted), an invisible honeypot `website`, and an optional Turnstile token. After success it shows a thank-you panel (links to `/portal` and WhatsApp) instead of the form.

**Server** (`src/app/api/contact/route.js`), in this order: size limit (12k chars) -> JSON parse -> per-IP rate limit (5 per 10 min, in memory so best-effort on serverless; returns 429 + `Retry-After`) -> honeypot or filled in under 2.5 s (silent `{ ok: true }` so bots do not adapt) -> form older than 24 h (400) -> field validation (400 with `fields` map for per-field errors) -> optional Turnstile -> Nodemailer to `TO_EMAIL`. Success is `{ ok: true }`; send failure is 500 `Send failed`.

## Environment

`SMTP_HOST/PORT/USER/PASS`, `TO_EMAIL` (required). Optional Cloudflare Turnstile: set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (widget appears) and `TURNSTILE_SECRET_KEY` (server verifies). Without them the form relies on honeypot + timing + rate limit.

## Test without sending email

Start a production build with a dead SMTP so validation runs but nothing is delivered:

```bash
SMTP_HOST=127.0.0.1 SMTP_PORT=1 SMTP_USER=x SMTP_PASS=x TO_EMAIL=nobody@example.invalid npx next start -p 3200 &
now=$(python3 -c "import time;print(int(time.time()*1000))"); old=$((now-6000))
# valid -> 500 "Send failed" (validation passed, delivery refused on purpose)
curl -s -X POST localhost:3200/api/contact -H 'Content-Type: application/json' -d "{\"name\":\"Test User\",\"email\":\"t@example.com\",\"message\":\"Hello, I need a website.\",\"openedAt\":$old}"
# invalid -> 400 with fields;  honeypot/too-fast -> 200 {ok:true};  7th call in 10 min -> 429
```

Restart the server to reset the in-memory rate limiter between runs. To see the thank-you panel, stub `window.fetch` through `scripts/shoot.mjs` (`EVAL=`) instead of sending mail.

## Rules

- Do not reintroduce the browser-only math captcha; protection lives on the server.
- Keep error text human and field-specific; never expose SMTP or stack details.
- Do not promise a reply time (no invented SLA) in the thank-you copy.

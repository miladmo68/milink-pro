# Collecting real testimonials (the seven Work clients)

The homepage testimonials are placeholders (see `PROJECT_CONTEXT.md`, section 12). Real clients stand behind the seven projects in the Work section, so the honest fix is to ask them. Send the message below by WhatsApp or email, publish **only what they send back and approve**, and keep their wording.

| # | Project | Live site | Asked | Received | Approved to publish |
| - | ------- | --------- | ----- | -------- | ------------------- |
| 1 | Fair Construction | https://fairconstructions.ca/ | ☐ | ☐ | ☐ |
| 2 | Kind Steps | https://kindsteps.ca/ | ☐ | ☐ | ☐ |
| 3 | Intershine | https://intershine-ca.vercel.app/ | ☐ | ☐ | ☐ |
| 4 | Zarsa Gold | https://zarsa.ca/ | ☐ | ☐ | ☐ |
| 5 | Sky Contracting Inc | https://skyinc.ca | ☐ | ☐ | ☐ |
| 6 | Tarahan Choob | https://woodline-ir.vercel.app/ | ☐ | ☐ | ☐ |
| 7 | PEG Studio | https://peg-studio-ten.vercel.app/ | ☐ | ☐ | ☐ |

## Message to send (WhatsApp / email)

> Hi {Name}, it's Milad from MiLink. Thank you again for trusting us with {Business}'s website.
>
> I'm updating our own site and would really appreciate a couple of sentences from you about working with us. You can answer in your own words. If it helps, here are three prompts:
>
> 1. What was the situation before the new website?
> 2. What was it like working with us?
> 3. What has changed since it launched?
>
> May I show your name and business next to it? I'll only publish it after you've seen and approved the final wording. Thank you so much!

## Suggested wording to offer each client (drafts for their approval)

Many clients are happy to approve a short draft instead of writing from scratch. Send each client **their** draft below as *suggested wording they can edit or replace*, together with the message above. **A draft is not a testimonial until the client says yes**; do not publish any of these on the site without that approval, and use their edited version if they change it. The drafts are written only from what each live site visibly is: no numbers, rankings or results (add one only if the client gives it to you).

1. **Fair Construction**
   > MiLink built us a website that looks as solid as the work we do. Our projects are shown clearly, the estimate request is easy to find, and they kept us updated at every step.

2. **Kind Steps**
   > Our families needed a site that felt warm and clear. MiLink listened, explained each step in plain language, and delivered a site that is easy to navigate and makes booking a consultation simple.

3. **Intershine**
   > MiLink made it easy for customers to see our services and packages and to book with us. They responded quickly and were easy to work with from start to finish.

4. **Zarsa Gold**
   > The website shows our jewelry the way we imagined: elegant, simple and easy to browse. MiLink took care of the details and made custom orders easy for our customers to start.

5. **Sky Contracting**
   > MiLink gave us a clean, professional website that presents our services and work clearly. Communication was straightforward, and the result reflects how we do business.

6. **Tarahan Choob** (the client may prefer to approve in their own language; publish only an English version they have read and approved)
   > MiLink delivered a website that reads properly in Persian and shows our cabinetry and furniture work beautifully. They understood what we wanted and made the process easy.

7. **PEG Studio**
   > We wanted a calm, editorial site that matches the spirit of our design work. MiLink picked up our style quickly and delivered what we described.

## Rules

- The site is English-only: quotes are published in English. If a client replies in another language, publish an English translation only after they have read and approved it.
- Publish only text the client sent and approved. Fix typos only with their OK; never change the meaning, add praise, or merge quotes.
- If a client was offered anything in return (discount, gift), say so next to the quote.
- Show a real name and business, and link the project in Work when they agree.

## Adding an approved quote to the site

In `src/data/content.js`, replace the placeholder entries of `testimonials` with real ones:

```js
{ name: "Client Name", role: "Owner, Business Name", text: "Exactly what they approved." },
```

`src/sections/Testimonials.jsx` renders nothing for an empty array. If the section is hidden, also review the nav entry (`nav` in `content.js`) and the `/testimonials` entry in `src/config/site.js` (sitemap).

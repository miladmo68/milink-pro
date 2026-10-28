import { whatsappLinks } from "../config/business.js";

/**
 * Click handler for WhatsApp links: on phones it opens the app directly,
 * everywhere else the normal wa.me link proceeds.
 */
export function openWhatsApp(event, text) {
  if (typeof navigator === "undefined") return;
  if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
    event.preventDefault();
    window.location.href = whatsappLinks(text).app;
  }
}

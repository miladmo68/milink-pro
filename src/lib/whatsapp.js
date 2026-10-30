import { whatsappLinks } from "../config/business.js";
import { track } from "./track";

/**
 * Click handler for WhatsApp links: on phones it opens the app directly,
 * everywhere else the normal wa.me link proceeds.
 */
export function openWhatsApp(event, text) {
  if (typeof navigator === "undefined") return;
  track("whatsapp_click");
  if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
    event.preventDefault();
    window.location.href = whatsappLinks(text).app;
  }
}

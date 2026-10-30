// Single source of truth for who MiLink is and how to reach it. Every
// component, route handler and schema block reads these values from here;
// never type a phone number, handle or address into a component again.

export const BUSINESS = {
  name: "Milink Digital Agency",
  brand: "MiLink",
  url: "https://milink.ca",
  email: "info@milink.ca",
  // Where clients send Interac e-Transfers (shown on the portal Payments page).
  eTransferEmail: "miladmo68@gmail.com",
  // Card payments add this percent on top of the price; e-Transfer pays the price only (owner's decision).
  // The line is called "HST (13%)" once hstNumber is set, "Card fee (13%)" until then. 0 turns it off.
  cardExtraPercent: 13,
  // HST registration number, e.g. "123456789 RT0001". Printed on receipts when set.
  hstNumber: "",
  phone: {
    display: "+1 (437) 600-3139",
    tel: "+14376003139",
    digits: "14376003139",
    schema: "+1-437-600-3139",
  },
  address: {
    short: "GTA, Ontario, Canada",
  },
  instagram: {
    handle: "@milink.ca",
    url: "https://instagram.com/milink.ca",
  },
  // Add a real profile URL here to show a LinkedIn icon in the footer.
  linkedinUrl: "",
  portfolioUrl: "https://miladweb.com",
  whatsappMessage: "Hi Milink! I'm interested in your services.",
  // Shown under the contact form when set, e.g. "We usually reply within one business day."
  // Leave empty until the owner confirms a real reply time; never promise one that is not kept.
  replyTime: "",
};

/** Google Maps search link for the public service area. */
export const mapsUrl = () =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS.address.short)}`;

/** wa.me link for browsers, plus the app deep link used on phones. */
export function whatsappLinks(text = BUSINESS.whatsappMessage) {
  const query = encodeURIComponent(text);
  return {
    web: `https://wa.me/${BUSINESS.phone.digits}?text=${query}`,
    app: `whatsapp://send?phone=${BUSINESS.phone.digits}&text=${query}`,
  };
}

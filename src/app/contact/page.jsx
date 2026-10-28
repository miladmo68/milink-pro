import ContactPageContent from "./ContactPageContent.jsx";
import { BUSINESS } from "../../config/business.js";

export const metadata = {
  title: "Contact — Book a Call with MILINK",
  description:
    `Get in touch with MILINK for web design, e-commerce, SEO, and branding. Call ${BUSINESS.phone.display} or send a message.`,
  alternates: {
    canonical: "https://milink.ca/contact",
  },
};

export default function ContactPage() {
  return <ContactPageContent />;
}

import PricingPageContent from "./PricingPageContent.jsx";
import { pricing } from "../../data/content.js";

const essentialPackage = pricing.find((plan) => plan.name === "Essential");
const essentialStartingPrice = `${essentialPackage.startingPrice} ${essentialPackage.priceCurrency}`;

export const metadata = {
  title: `Website Pricing — One-Page Websites From ${essentialStartingPrice}`,
  description:
    `Toronto and GTA one-page business websites starting from ${essentialStartingPrice}. Explore Essential, Professional, and e-commerce website packages.`,
  alternates: {
    canonical: "https://milink.ca/pricing",
  },
};

export default function PricingPage() {
  return <PricingPageContent />;
}

"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Hero from "../sections/Hero.jsx";
import Services from "../sections/Services.jsx";
import Work from "../sections/Work.jsx";
import Pricing from "../sections/Pricing.jsx";
import Testimonials from "../sections/Testimonials.jsx";
import FAQ from "../sections/FAQ.jsx";
import Contact from "../sections/Contact.jsx";
import { faqJsonLd } from "../data/content.js";

const Modal = lazy(() => import("../components/Modal.jsx"));
const Lightbox = lazy(() => import("../components/Lightbox.jsx"));

export default function HomePage() {
  const router = useRouter();
  const [modal, setModal] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [authRedirecting, setAuthRedirecting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) return;
    params.set("next", "/portal");
    setAuthRedirecting(true);
    const callbackUrl = new URL("/auth/callback", window.location.origin);
    callbackUrl.search = params.toString();
    router.replace(`${callbackUrl.pathname}${callbackUrl.search}`);
  }, [router]);

  if (authRedirecting) return null;

  return (
    <>
      <Navbar />

      <main>
        <h1 className="sr-only">
          MILINK — Web Design, E-Commerce Solutions, SEO, UI/UX & Branding
        </h1>

        <nav aria-label="Primary internal links" className="sr-only">
          <a href="/#services">Our Services</a> • <a href="/#work">Work</a> •{" "}
          <a href="/#pricing">Pricing</a> •{" "}
          <a href="/#testimonials">Testimonials</a> •{" "}
          <a href="/#faq">FAQ</a> •{" "}
          <a href="/#contact">Contact</a>
        </nav>

        <section id="hero" aria-label="Hero">
          <h2 className="sr-only">Welcome to MILINK</h2>
          <Hero onOpenLightbox={(img) => setLightbox(img)} />
        </section>

        <section aria-label="Our Services">
          <h2 className="sr-only">Our Services</h2>
          <Services onOpen={(payload) => setModal(payload)} />
        </section>

        <section aria-label="Selected Work">
          <h2 className="sr-only">Selected Work & Case Studies</h2>
          <Work onOpen={(payload) => setModal(payload)} />
        </section>

        <section aria-label="Pricing & Packages">
          <h2 className="sr-only">Pricing & Packages</h2>
          <Pricing />
        </section>

        <section aria-label="Testimonials">
          <h2 className="sr-only">Testimonials</h2>
          <Testimonials />
        </section>

        <FAQ />

        <section aria-label="Contact">
          <h2 className="sr-only">Contact</h2>
          <Contact />
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />

      <Footer />

      <Suspense fallback={null}>
        {modal && <Modal payload={modal} onClose={() => setModal(null)} />}
        {lightbox && (
          <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
        )}
      </Suspense>
    </>
  );
}

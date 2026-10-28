"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar.jsx";
import Hero from "../sections/Hero.jsx";
import { faqJsonLd } from "../data/content.js";

// Everything below the Hero is split into its own chunk and hydrated on its
// own Suspense boundary. Their HTML is still server-rendered (SEO and #anchor
// links are unchanged), but React no longer hydrates the whole page in one
// long task, which is what blocked mobile input for ~3s.
const Services = dynamic(() => import("../sections/Services.jsx"));
const Work = dynamic(() => import("../sections/Work.jsx"));
const Process = dynamic(() => import("../sections/Process.jsx"));
const Pricing = dynamic(() => import("../sections/Pricing.jsx"));
const Testimonials = dynamic(() => import("../sections/Testimonials.jsx"));
const FAQ = dynamic(() => import("../sections/FAQ.jsx"));
const Contact = dynamic(() => import("../sections/Contact.jsx"));
const Footer = dynamic(() => import("../components/Footer.jsx"));

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
    <div className="marketing-site">
      <Navbar />

      <main>
        <nav aria-label="Primary internal links" className="sr-only">
          <a href="/#services">Our Services</a> • <a href="/#work">Work</a> •{" "}
          <a href="/#pricing">Pricing</a> •{" "}
          <a href="/#testimonials">Testimonials</a> •{" "}
          <a href="/#faq">FAQ</a> •{" "}
          <a href="/#contact">Contact</a>
        </nav>

        <section id="hero" aria-label="Hero">
          <Hero onOpenLightbox={(img) => setLightbox(img)} />
        </section>

        <section aria-label="Our Services">
          <Services onOpen={(payload) => setModal(payload)} />
        </section>

        <section aria-label="Selected Work">
          <Work onOpen={(payload) => setModal(payload)} />
        </section>

        <section aria-label="How We Work">
          <Process />
        </section>

        <section aria-label="Pricing & Packages">
          <Pricing />
        </section>

        <section aria-label="Testimonials">
          <Testimonials />
        </section>

        <FAQ />

        <section aria-label="Contact">
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
    </div>
  );
}

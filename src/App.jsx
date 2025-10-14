// src/App.jsx
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./sections/Hero.jsx";
import Services from "./sections/Services.jsx";
import Work from "./sections/Work.jsx";
import Pricing from "./sections/Pricing.jsx";
import Testimonials from "./sections/Testimonials.jsx";
import FAQ from "./sections/FAQ.jsx";
import Contact from "./sections/Contact.jsx";
import { useState, Suspense, lazy } from "react";

import SEO from "./components/SEO.jsx";

const Modal = lazy(() => import("./components/Modal.jsx"));
const Lightbox = lazy(() => import("./components/Lightbox.jsx"));

export default function App() {
  const [modal, setModal] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      {/* Meta for HOME (one-page) */}
      <SEO
        title="MILINK — Web Design, E-Commerce, SEO & Branding in Toronto"
        description="Our services include Web Design and Development, E-Commerce Solutions (Shopify, WordPress), SEO & Performance Optimization, UI/UX, Branding/Identity, and ongoing Website Maintenance & Support."
        path="/" // canonical = https://milink.ca/
        // image پیش‌فرض از SEO.jsx می‌آید (og-cover.jpg). اگر نداری: image="https://milink.ca/logo1.png"
        type="website"
      />

      <Navbar />

      <main>
        {/* H1 واحد برای صفحه (نامرئی تا UI بهم نخوره) */}
        <h1 className="sr-only">
          MILINK — Web Design, E-Commerce Solutions, SEO, UI/UX & Branding
        </h1>

        {/* ناوبری داخلی برای حل «very few internal links» (نامرئی) */}
        <nav aria-label="Primary internal links" className="sr-only">
          <a href="#services">Our Services</a> • <a href="#work">Work</a> •{" "}
          <a href="#pricing">Pricing</a> •{" "}
          <a href="#testimonials">Testimonials</a> •{" "}
          <a href="#contact">Contact</a>
        </nav>

        {/* HERO (اگر داخل Hero سرتیتر بصری داری، ok) */}
        <section id="hero" aria-label="Hero">
          {/* هدر نامرئی برای ساختار هدینگ */}
          <h2 className="sr-only">Welcome to MILINK</h2>
          <Hero onOpenLightbox={(img) => setLightbox(img)} />
        </section>

        {/* SERVICES */}
        <section id="services" aria-label="Our Services">
          <h2 className="sr-only">Our Services</h2>
          {/* اگر خود Services هدر دارد، این sr-only مزاحم UI نمی‌شود اما ساختار را کامل می‌کند */}
          <Services onOpen={(payload) => setModal(payload)} />
        </section>

        {/* WORK */}
        <section id="work" aria-label="Selected Work">
          <h2 className="sr-only">Selected Work & Case Studies</h2>
          <Work onOpen={(payload) => setModal(payload)} />
        </section>

        {/* PRICING */}
        <section id="pricing" aria-label="Pricing & Packages">
          <h2 className="sr-only">Pricing & Packages</h2>
          <Pricing />
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" aria-label="Testimonials">
          <h2 className="sr-only">Testimonials</h2>
          <Testimonials />
        </section>

        {/* FAQ (اگه خواستی فعالش کن) */}
        {/* <section id="faq" aria-label="FAQ">
          <h2 className="sr-only">Frequently Asked Questions</h2>
          <FAQ />
        </section> */}

        {/* CONTACT — اگر Contact یک سکشن پایین صفحه‌ست */}
        <section id="contact" aria-label="Contact">
          <h2 className="sr-only">Contact</h2>
          {/* اگر Contact در sections/Contact.jsx هست و خودش هدر دارد، همین کافی است */}
          <Contact />
        </section>
      </main>

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

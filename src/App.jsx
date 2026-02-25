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
        type="website"
      />

      <Navbar />

      <main>
        <h1 className="sr-only">
          MILINK — Web Design, E-Commerce Solutions, SEO, UI/UX & Branding
        </h1>

        <nav aria-label="Primary internal links" className="sr-only">
          <a href="#services">Our Services</a> • <a href="#work">Work</a> •{" "}
          <a href="#pricing">Pricing</a> •{" "}
          <a href="#testimonials">Testimonials</a> •{" "}
          <a href="#contact">Contact</a>
        </nav>

        <section id="hero" aria-label="Hero">
          <h2 className="sr-only">Welcome to MILINK</h2>
          <Hero onOpenLightbox={(img) => setLightbox(img)} />
        </section>

        {/* SERVICES */}
        <section id="services" aria-label="Our Services">
          <h2 className="sr-only">Our Services</h2>
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

        {/* <section id="faq" aria-label="FAQ">
          <h2 className="sr-only">Frequently Asked Questions</h2>
          <FAQ />
        </section> */}

        <section id="contact" aria-label="Contact">
          <h2 className="sr-only">Contact</h2>
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

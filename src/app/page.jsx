"use client";

import { useState, Suspense, lazy } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Hero from "../sections/Hero.jsx";
import Services from "../sections/Services.jsx";
import Work from "../sections/Work.jsx";
import Pricing from "../sections/Pricing.jsx";
import Testimonials from "../sections/Testimonials.jsx";
import Contact from "../sections/Contact.jsx";

const Modal = lazy(() => import("../components/Modal.jsx"));
const Lightbox = lazy(() => import("../components/Lightbox.jsx"));

export default function HomePage() {
  const [modal, setModal] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
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

        <section id="services" aria-label="Our Services">
          <h2 className="sr-only">Our Services</h2>
          <Services onOpen={(payload) => setModal(payload)} />
        </section>

        <section id="work" aria-label="Selected Work">
          <h2 className="sr-only">Selected Work & Case Studies</h2>
          <Work onOpen={(payload) => setModal(payload)} />
        </section>

        <section id="pricing" aria-label="Pricing & Packages">
          <h2 className="sr-only">Pricing & Packages</h2>
          <Pricing />
        </section>

        <section id="testimonials" aria-label="Testimonials">
          <h2 className="sr-only">Testimonials</h2>
          <Testimonials />
        </section>

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

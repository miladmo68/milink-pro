import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./sections/Hero.jsx";
import Services from "./sections/Services.jsx";
import Work from "./sections/Work.jsx";
import Pricing from "./sections/Pricing.jsx";
import Testimonials from "./sections/Testimonials.jsx";
import FAQ from "./sections/FAQ.jsx";
import { useState, Suspense, lazy } from "react";

// ➊ اضافه کن:
import SEO from "./components/SEO.jsx";

const Modal = lazy(() => import("./components/Modal.jsx"));
const Lightbox = lazy(() => import("./components/Lightbox.jsx"));

export default function App() {
  const [modal, setModal] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      {/* ➋ متای اختصاصی صفحه‌ی اصلی (HOME) */}
      <SEO
        title="Milink — Luxury Web Design & Development in Toronto"
        description="We design, Launch, and Scale premium websites & e-commerce. performance, SEO, and analytics baked in."
        path="/" // canonical = https://milink.ca/
        image="https://milink.ca/logo1.png" // مطلق (برای واتساپ/تلگرام مهمه)
        type="website"
      />

      <Navbar />

      <main>
        {/* ➌ H1 واحد برای این صفحه (نامرئی بصری ولی مفید برای SEO) */}
        <h1 className="sr-only">
          Milink — Design • Launch • Scale — Premium Web Design &Development
        </h1>

        {/* سکشن‌ها */}
        <Hero onOpenLightbox={(img) => setLightbox(img)} />
        <Services onOpen={(payload) => setModal(payload)} />
        <Work onOpen={(payload) => setModal(payload)} />
        <Pricing />
        <Testimonials />
        {/* <FAQ /> */}
        {/* اگر Navbar لینک‌های داخلی دارد، خوبه؛
            اگر نه، یک بلوک لینک داخلی کوچک هم می‌تونی بگذاری: 
            <nav aria-label="Primary" className="sr-only">
              <a href="#services">Services</a> • <a href="#pricing">Pricing</a> • <a href="#work">Work</a> • <a href="#contact">Contact</a>
            </nav>
        */}
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

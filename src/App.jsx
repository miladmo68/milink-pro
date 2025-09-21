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

const Modal = lazy(() => import("./components/Modal.jsx"));
const Lightbox = lazy(() => import("./components/Lightbox.jsx"));

export default function App() {
  const [modal, setModal] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  return (
    <div>
      <Navbar />
      <main>
        <Hero onOpenLightbox={(img) => setLightbox(img)} />
        <Services onOpen={(payload) => setModal(payload)} />
        {/* <Work onOpen={(payload) => setModal(payload)} /> */}
        <Pricing />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
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

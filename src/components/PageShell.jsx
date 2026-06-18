"use client";

import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function PageShell({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-20 md:pt-24">{children}</main>
      <Footer />
    </>
  );
}

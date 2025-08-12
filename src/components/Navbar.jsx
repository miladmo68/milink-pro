import { useEffect, useState } from "react";
import { nav } from "../data/content.js";
import { SITE } from "../config/siteConfig.js";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Navbar(){
  const [open,setOpen] = useState(false);
  const [scrolled,setScrolled] = useState(false);
  useEffect(()=>{
    const onScroll = ()=> setScrolled(window.scrollY>12);
    window.addEventListener("scroll", onScroll);
    return ()=> window.removeEventListener("scroll", onScroll);
  },[]);

  return (
    <header className={`sticky top-0 z-50 transition-all ${SITE.enableStickyBlur && scrolled? "backdrop-blur bg-base-100/70 shadow-glow" : "bg-transparent"}`}>
      <div className="container navbar py-3">
        <div className="flex-1">
          <a href="#home" className="text-xl font-display font-extrabold text-primary">Milink</a>
        </div>
        <nav className="hidden md:flex gap-6">
          {nav.map((n,i)=>(<a key={i} href={n.href} className="link link-hover">{n.label}</a>))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a href="#contact" className="btn btn-primary btn-sm hidden md:inline-flex">Book a Call</a>
          <button className="btn btn-ghost btn-sm md:hidden" onClick={()=>setOpen(!open)} aria-label="menu">≡</button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-base-100 border-t">
          <div className="container py-2 flex flex-col">
            {nav.map((n,i)=>(<a key={i} href={n.href} className="py-2" onClick={()=>setOpen(false)}>{n.label}</a>))}
          </div>
        </div>
      )}
    </header>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring_pos = useRef({ x: -100, y: -100 });
  const raf = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [viewText, setViewText] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onEnter = (e) => {
      const el = e.target;
      if (el.closest("[data-cursor='view']")) {
        setViewText(true);
        setHovered(true);
      } else if (el.closest("a, button, [role='button'], label")) {
        setHovered(true);
        setViewText(false);
      }
    };
    const onLeave = () => { setHovered(false); setViewText(false); };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);

    const lerp = (a, b, n) => a + (b - a) * n;

    const animate = () => {
      ring_pos.current.x = lerp(ring_pos.current.x, pos.current.x, 0.12);
      ring_pos.current.y = lerp(ring_pos.current.y, pos.current.y, 0.12);

      if (dot.current) {
        dot.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate(${ring_pos.current.x - 20}px, ${ring_pos.current.y - 20}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <style>{`@media (pointer: coarse) { .custom-cursor { display: none !important; } } @media (pointer: fine) { * { cursor: none !important; } }`}</style>
      {/* Dot */}
      <div
        ref={dot}
        className="custom-cursor pointer-events-none fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full"
        style={{
          background: "var(--accent)",
          opacity: hovered ? 0 : 1,
          transition: "opacity 0.15s ease, transform 0.05s linear",
          willChange: "transform",
        }}
      />
      {/* Ring */}
      <div
        ref={ring}
        className="custom-cursor pointer-events-none fixed top-0 left-0 z-[9999] w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          border: `1.5px solid var(--accent)`,
          background: hovered ? "rgba(0,96,255,0.10)" : "transparent",
          transform: hovered
            ? "translate(-20px,-20px) scale(1.5)"
            : "translate(-20px,-20px) scale(1)",
          transition: "background 0.2s ease, border-color 0.2s ease",
          willChange: "transform",
        }}
      >
        {viewText && (
          <span
            style={{
              fontSize: "7px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "var(--accent)",
              userSelect: "none",
            }}
          >
            VIEW
          </span>
        )}
      </div>
    </>
  );
}

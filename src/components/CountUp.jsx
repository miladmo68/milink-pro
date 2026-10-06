"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export default function CountUp({
  to,
  from = 0,
  duration = 1600,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
  style,
  once = true,
  amount = 0.4,
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  // Render the actual target immediately so the static HTML is useful to
  // crawlers, no-JS visitors, and users before the enhancement starts.
  const [value, setValue] = useState(to);
  const startedRef = useRef(false);

  useEffect(() => {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;
    let animationFrame = 0;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          if (once && startedRef.current) return;
          startedRef.current = true;

          setValue(from);
          const start = performance.now();
          const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = easeOutCubic(t);
            setValue(from + (to - from) * eased);
            if (t < 1) animationFrame = requestAnimationFrame(tick);
          };
          animationFrame = requestAnimationFrame(tick);

          if (once) io.disconnect();
        });
      },
      { threshold: amount }
    );

    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [to, from, duration, once, amount, reduced]);

  const display = Number.isFinite(value) ? value.toFixed(decimals) : `${to}`;

  return (
    <span ref={ref} className={className} style={style}>
      <span aria-hidden="true">{prefix}{display}{suffix}</span>
      <span className="sr-only">{prefix}{Number(to).toFixed(decimals)}{suffix}</span>
    </span>
  );
}

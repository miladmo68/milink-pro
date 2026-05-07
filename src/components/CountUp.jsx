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
  const [value, setValue] = useState(reduced ? to : from);
  const startedRef = useRef(false);

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return;
    }
    const node = ref.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          if (once && startedRef.current) return;
          startedRef.current = true;

          const start = performance.now();
          let raf = 0;
          const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = easeOutCubic(t);
            setValue(from + (to - from) * eased);
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);

          if (once) io.disconnect();
          return () => cancelAnimationFrame(raf);
        });
      },
      { threshold: amount }
    );

    io.observe(node);
    return () => io.disconnect();
  }, [to, from, duration, once, amount, reduced]);

  const display = Number.isFinite(value) ? value.toFixed(decimals) : `${to}`;

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

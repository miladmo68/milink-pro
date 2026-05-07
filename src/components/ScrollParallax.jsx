"use client";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

export default function ScrollParallax({
  children,
  offset = 60,
  className,
  style,
  as = "div",
  ariaHidden = true,
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [-offset, offset]
  );

  const Comp = motion[as] ?? motion.div;

  return (
    <Comp
      ref={ref}
      aria-hidden={ariaHidden}
      style={{ ...style, y, willChange: reduced ? undefined : "transform" }}
      className={className}
    >
      {children}
    </Comp>
  );
}

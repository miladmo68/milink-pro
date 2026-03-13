import React, { useMemo, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/* ===== Shared motion constants (one source of truth) ===== */
export const REVEAL_EASE = [0.22, 1, 0.36, 1];
export const REVEAL_DURATION_IN = 0.5;
export const REVEAL_DURATION_OUT = 0.4;
export const REVEAL_STAGGER = 0.1;
export const REVEAL_DELAY_CHILDREN = 0.04;

export function Reveal({
  fade = true,
  distance = 0,
  x,
  y,
  from = "none",
  durationIn = REVEAL_DURATION_IN,
  durationOut = REVEAL_DURATION_OUT,
  delay = 0,
  ease = REVEAL_EASE,
  exitWhenHidden = true,
  once = true,
  amount = 0.25,
  margin = "-10% 0px -10% 0px",
  forceInView,
  as = "div",
  className,
  children,
  ...rest
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { amount, margin, once });
  const active = forceInView !== undefined ? forceInView : inView;

  const [initX, initY] = React.useMemo(() => {
    if (reduced) return [0, 0];
    if (typeof x === "number" || typeof y === "number") return [x ?? 0, y ?? 0];
    if (from === "left") return [-Math.abs(distance), 0];
    if (from === "right") return [Math.abs(distance), 0];
    if (from === "up") return [0, Math.abs(distance)];
    if (from === "down") return [0, -Math.abs(distance)];
    return [0, 0];
  }, [reduced, x, y, from, distance]);

  const durIn = reduced ? 0 : durationIn;
  const durOut = reduced ? 0 : durationOut;

  const initial = { opacity: fade && !reduced ? 0 : 1, x: initX, y: initY };
  const visible = {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: durIn, ease, delay: reduced ? 0 : delay },
  };
  const hidden = {
    opacity: fade && !reduced ? 0 : 1,
    x: initX * 0.7,
    y: initY * 0.7,
    transition: { duration: durOut, ease },
  };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={active ? visible : exitWhenHidden ? hidden : undefined}
      className={[
        !reduced && "will-change-transform will-change-opacity",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function RevealStagger({
  itemsSelector = "> *",
  stagger = REVEAL_STAGGER,
  delayChildren = REVEAL_DELAY_CHILDREN,
  itemDistance = 18,
  itemFrom = "up",
  itemFade = true,
  once = true,
  amount = 0.25,
  margin = "-10% 0px -10% 0px",
  exitWhenHidden = true,
  className,
  children,
  ...rest
}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { amount, margin, once });

  const parent = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : stagger,
        delayChildren: reduced ? 0 : delayChildren,
      },
    },
  };

  const [ix, iy] = useMemo(() => {
    if (reduced) return [0, 0];
    if (itemFrom === "left") return [-Math.abs(itemDistance), 0];
    if (itemFrom === "right") return [Math.abs(itemDistance), 0];
    if (itemFrom === "up") return [0, Math.abs(itemDistance)];
    if (itemFrom === "down") return [0, -Math.abs(itemDistance)];
    return [0, 0];
  }, [reduced, itemFrom, itemDistance]);

  const childDur = reduced ? 0 : REVEAL_DURATION_IN;
  const child = {
    hidden: { opacity: itemFade && !reduced ? 0 : 1, x: ix, y: iy },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: childDur, ease: REVEAL_EASE },
    },
    exit: {
      opacity: itemFade && !reduced ? 0 : 1,
      x: ix * 0.7,
      y: iy * 0.7,
      transition: { duration: reduced ? 0 : REVEAL_DURATION_OUT, ease: REVEAL_EASE },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={parent}
      initial="hidden"
      animate={inView ? "visible" : exitWhenHidden ? "hidden" : "visible"}
      className={[
        !reduced && "will-change-transform will-change-opacity",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {React.Children.map(children, (childNode) => {
        if (!React.isValidElement(childNode)) return childNode;
        return (
          <motion.div
            variants={child}
            className={!reduced ? "will-change-transform will-change-opacity" : undefined}
          >
            {childNode}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function SlideIn({ dir = "up", dist = 24, ...rest }) {
  return <Reveal from={dir} distance={dist} {...rest} />;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}) {
  return (
    <div
      className={[
        "mx-auto max-w-3xl",
        align === "left" ? "text-left" : "text-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {eyebrow && (
        <Reveal from="up" distance={12}>
          <div className="badge badge-outline mb-3">{eyebrow}</div>
        </Reveal>
      )}
      <Reveal from="up" distance={22}>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
          {title}
        </h2>
      </Reveal>
      {subtitle && (
        <Reveal from="up" distance={18}>
          <p className="mt-3 opacity-80">{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}

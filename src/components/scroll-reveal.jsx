import React, { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";

export function Reveal({
  fade = true,
  distance = 0,
  x,
  y,
  from = "none",
  durationIn = 0.6,
  durationOut = 0.5,
  delay = 0,
  ease = [0.4, 0, 0.2, 1],
  exitWhenHidden = true,
  once = false,
  amount = 0.25,
  margin = "-10% 0px -10% 0px",
  forceInView,
  as = "div",
  className,
  children,
  ...rest
}) {
  const Comp = as;
  const ref = useRef(null);
  const inView = useInView(ref, { amount, margin, once });
  const active = forceInView !== undefined ? forceInView : inView;

  const [initX, initY] = React.useMemo(() => {
    if (typeof x === "number" || typeof y === "number") return [x ?? 0, y ?? 0];
    if (from === "left") return [-Math.abs(distance), 0];
    if (from === "right") return [Math.abs(distance), 0];
    if (from === "up") return [0, Math.abs(distance)];
    if (from === "down") return [0, -Math.abs(distance)];
    return [0, 0];
  }, [x, y, from, distance]);

  const initial = { opacity: fade ? 0 : 1, x: initX, y: initY };
  const visible = {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: durationIn, ease, delay },
  };
  const hidden = {
    opacity: fade ? 0 : 1,
    x: initX * 0.7,
    y: initY * 0.7,
    transition: { duration: durationOut, ease },
  };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={active ? visible : exitWhenHidden ? hidden : undefined}
      className={["will-change-transform will-change-opacity", className]
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
  stagger = 0.12,
  delayChildren = 0.05,
  itemDistance = 18,
  itemFrom = "up",
  itemFade = true,
  once = false,
  amount = 0.25,
  margin = "-10% 0px -10% 0px",
  exitWhenHidden = true,
  className,
  children,
  ...rest
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount, margin, once });

  const parent = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };

  const [ix, iy] = useMemo(() => {
    if (itemFrom === "left") return [-Math.abs(itemDistance), 0];
    if (itemFrom === "right") return [Math.abs(itemDistance), 0];
    if (itemFrom === "up") return [0, Math.abs(itemDistance)];
    if (itemFrom === "down") return [0, -Math.abs(itemDistance)];
    return [0, 0];
  }, [itemFrom, itemDistance]);

  const child = {
    hidden: { opacity: itemFade ? 0 : 1, x: ix, y: iy },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      opacity: itemFade ? 0 : 1,
      x: ix * 0.7,
      y: iy * 0.7,
      transition: { duration: 0.4, ease: "easeIn" },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={parent}
      initial="hidden"
      animate={inView ? "visible" : exitWhenHidden ? "hidden" : "visible"}
      className={["will-change-transform will-change-opacity", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {React.Children.map(children, (childNode) => {
        if (!React.isValidElement(childNode)) return childNode;
        return (
          <motion.div
            variants={child}
            className="will-change-transform will-change-opacity"
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

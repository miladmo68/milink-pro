import { forwardRef } from "react";

// The one button for the public site. It only composes the `.marketing-cta`
// classes from globals.css, so every CTA shares the same shape, motion and
// focus ring. Use `href` for links and `onClick`/`type` for buttons.
//
//   <Button href="#contact" arrow>Get a quote</Button>
//   <Button variant="secondary" size="compact" onClick={...}>Cancel</Button>
//
// variant: "primary" | "secondary"   size: "default" | "compact" | "block"

const VARIANTS = { primary: "marketing-cta--primary", secondary: "marketing-cta--secondary" };
const SIZES = { default: "", compact: "marketing-cta--compact", block: "marketing-cta--block" };

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Button = forwardRef(function Button(
  { variant = "primary", size = "default", href, external = false, arrow = false, className = "", children, ...props },
  ref,
) {
  const classes = ["marketing-cta", VARIANTS[variant], SIZES[size], className].filter(Boolean).join(" ");
  const content = (
    <>
      {children}
      {arrow ? <Arrow /> : null}
    </>
  );

  if (href) {
    const rel = external ? "noreferrer noopener" : undefined;
    return (
      <a ref={ref} href={href} className={classes} target={external ? "_blank" : undefined} rel={rel} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button ref={ref} type="button" className={classes} {...props}>
      {content}
    </button>
  );
});

export default Button;

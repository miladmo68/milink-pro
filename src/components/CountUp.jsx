"use client";

export default function CountUp({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
  style,
}) {
  // The semantic value remains stable before and after hydration. Resetting it
  // to zero for a client-only count-up caused a visible first-load flash.
  const display = Number.isFinite(to) ? to.toFixed(decimals) : `${to}`;

  return (
    <span className={className} style={style}>
      <span aria-hidden="true">{prefix}{display}{suffix}</span>
      <span className="sr-only">{prefix}{Number(to).toFixed(decimals)}{suffix}</span>
    </span>
  );
}

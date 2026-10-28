"use client";

import PageShell from "./PageShell.jsx";

// `title` becomes the page's single <h1> (visually hidden: the section below
// already shows its own visible heading, which is an <h2>).
export default function SectionPage({ title, children }) {
  return (
    <PageShell>
      {title ? <h1 className="sr-only">{title}</h1> : null}
      {children}
    </PageShell>
  );
}

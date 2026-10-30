"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "../lib/track";

// Counts one page view per public page, after the page has loaded (never on /portal or /admin).
export default function SiteAnalytics() {
  const pathname = usePathname();
  useEffect(() => {
    if (/^\/(portal|admin|auth)/.test(pathname || "")) return undefined;
    const id = window.setTimeout(() => track("pageview"), 800);
    return () => window.clearTimeout(id);
  }, [pathname]);
  return null;
}

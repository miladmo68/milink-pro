// src/hooks/useTheme.js
import { useEffect, useState } from "react";

const KEY = "milink-theme"; // ذخیره حالت

export default function useTheme() {
  const [theme, setTheme] = useState("dark"); // پیش‌فرض

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem(KEY, theme);
    } catch {}
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return { theme, toggle };
}

// src/config/theme.js
import baseThemes from "daisyui/src/theming/themes";
// baseThemes["[data-theme=light]"] و baseThemes["[data-theme=dark]"]

export const THEMES = {
  light: {
    // نام سفارشی تم (همینی روی data-theme ست میشه)
    name: "milinklight",
    // وراثت از تم پیش‌فرض لایت DaisyUI
    ...baseThemes["[data-theme=light]"],
    // override های دلخواه:
    primary: "#8b6a1b", // طلایی گرم مناسب برندت
    secondary: "#0891b2",
    accent: "#a16207",
    neutral: "#0f172a",
    "base-100": "#ffffff", // پس‌زمینه لایت
    info: "#2563eb",
    success: "#16a34a",
    warning: "#d97706",
    error: "#b91c1c",
  },
  dark: {
    name: "milinkdark",
    ...baseThemes["[data-theme=dark]"],
    primary: "#d4af37", // طلایی لوکس در دارک
    secondary: "#22d3ee",
    accent: "#fbbf24",
    neutral: "#0b0f14",
    "base-100": "#0b0f14", // پس‌زمینه دارک
    info: "#60a5fa",
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
  },
};

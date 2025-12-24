// import { useEffect, useState, useCallback } from "react";

// function getGlobals() {
//   const MAP = (typeof window !== "undefined" && window.__THEME_MAP__) || {
//     light: "light",
//     dark: "dark",
//   };
//   const MODE_KEY =
//     (typeof window !== "undefined" && window.__MODE_KEY__) ||
//     "milink-theme-mode";
//   const LEGACY_KEY =
//     (typeof window !== "undefined" && window.__LEGACY_KEY__) || "milink-theme";
//   const DEFAULT_MODE =
//     (typeof window !== "undefined" && window.__DEFAULT_MODE__) || "dark";
//   return { MAP, MODE_KEY, LEGACY_KEY, DEFAULT_MODE };
// }

// function applyTheme(mode, MAP, DEFAULT_MODE) {
//   const physical = MAP[mode] || MAP[DEFAULT_MODE] || "light";
//   document.documentElement.setAttribute("data-theme", physical);
//   document.documentElement.classList.toggle("mode-dark", mode === "dark");
//   document.documentElement.classList.toggle("mode-light", mode === "light");
// }

// export default function useTheme() {
//   const { MAP, MODE_KEY, LEGACY_KEY, DEFAULT_MODE } = getGlobals();

//   const readInitial = () => {
//     try {
//       return (
//         localStorage.getItem(MODE_KEY) ||
//         localStorage.getItem(LEGACY_KEY) ||
//         DEFAULT_MODE
//       );
//     } catch {
//       return DEFAULT_MODE;
//     }
//   };

//   const [theme, setTheme] = useState(readInitial); // "light" | "dark"

//   useEffect(() => {
//     applyTheme(theme, MAP, DEFAULT_MODE);
//     try {
//       localStorage.setItem(MODE_KEY, theme);
//       localStorage.removeItem(LEGACY_KEY); // اختیاری
//     } catch {}
//   }, [theme, MAP, DEFAULT_MODE, MODE_KEY, LEGACY_KEY]);

//   const toggle = useCallback(
//     () => setTheme((t) => (t === "dark" ? "light" : "dark")),
//     []
//   );

//   const setLight = useCallback(() => setTheme("light"), []);
//   const setDark = useCallback(() => setTheme("dark"), []);

//   return {
//     theme, // "light" | "dark" (منطقی)
//     isDark: theme === "dark",
//     physicalTheme: MAP[theme], // نام تم DaisyUI جاری
//     toggle,
//     setLight,
//     setDark,
//   };
// }
import { useEffect, useState, useCallback, useMemo } from "react";

const FALLBACK_MAP = { light: "light", dark: "dark" }; // ✅ ثابت (هر بار new نمیشه)
const EVENT_NAME = "milink-theme-change";

function getGlobalsOnce() {
  const MAP =
    (typeof window !== "undefined" && window.__THEME_MAP__) || FALLBACK_MAP;

  const MODE_KEY =
    (typeof window !== "undefined" && window.__MODE_KEY__) ||
    "milink-theme-mode";

  const LEGACY_KEY =
    (typeof window !== "undefined" && window.__LEGACY_KEY__) || "milink-theme";

  const DEFAULT_MODE =
    (typeof window !== "undefined" && window.__DEFAULT_MODE__) || "dark";

  return { MAP, MODE_KEY, LEGACY_KEY, DEFAULT_MODE };
}

function applyTheme(mode, MAP, DEFAULT_MODE) {
  const physical = MAP[mode] || MAP[DEFAULT_MODE] || "light";
  document.documentElement.setAttribute("data-theme", physical);
  document.documentElement.classList.toggle("mode-dark", mode === "dark");
  document.documentElement.classList.toggle("mode-light", mode === "light");

  // اگر جایی tailwind dark: داری
  document.documentElement.classList.toggle("dark", mode === "dark");
}

export default function useTheme() {
  // ✅ globals فقط یکبار ساخته میشه
  const { MAP, MODE_KEY, LEGACY_KEY, DEFAULT_MODE } = useMemo(
    () => getGlobalsOnce(),
    []
  );

  const readStored = useCallback(() => {
    try {
      return (
        localStorage.getItem(MODE_KEY) ||
        localStorage.getItem(LEGACY_KEY) ||
        DEFAULT_MODE
      );
    } catch {
      return DEFAULT_MODE;
    }
  }, [MODE_KEY, LEGACY_KEY, DEFAULT_MODE]);

  const [theme, setTheme] = useState(readStored);

  // ✅ اعمال theme فقط بر اساس theme
  useEffect(() => {
    applyTheme(theme, MAP, DEFAULT_MODE);

    try {
      localStorage.setItem(MODE_KEY, theme);
      localStorage.removeItem(LEGACY_KEY);
    } catch {}

    // ✅ سینک کردن بقیه ThemeToggle ها در همین تب
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: theme }));
  }, [theme, MAP, DEFAULT_MODE, MODE_KEY, LEGACY_KEY]);

  // ✅ وقتی یک instance دیگه theme رو تغییر داد، این یکی هم آپدیت شه
  useEffect(() => {
    const onCustom = (e) => {
      const next = e?.detail;
      if (next === "light" || next === "dark") setTheme(next);
    };

    // برای تب‌های دیگه
    const onStorage = () => setTheme(readStored());

    window.addEventListener(EVENT_NAME, onCustom);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(EVENT_NAME, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [readStored]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const setLight = useCallback(() => setTheme("light"), []);
  const setDark = useCallback(() => setTheme("dark"), []);

  return {
    theme,
    isDark: theme === "dark",
    physicalTheme: MAP[theme],
    toggle,
    setLight,
    setDark,
  };
}

// src/components/ThemeToggle.jsx
import useTheme from "../hooks/useTheme";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      className={`btn btn-ghost btn-sm ${className}`}
      aria-label="Toggle theme"
      title={isDark ? "Switch to Light" : "Switch to Dark"}
    >
      {isDark ? "🌙" : "☀️"}
      <span className="ml-2 hidden sm:inline">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}

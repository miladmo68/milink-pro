import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import useTheme from "../hooks/useTheme";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={`btn btn-ghost btn-sm hover:bg-transparent focus:bg-transparent active:bg-transparent ${className}`}
      aria-label="Toggle theme"
      title={isDark ? "Switch to Light" : "Switch to Dark"}
    >
      {isDark ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </button>
  );
}

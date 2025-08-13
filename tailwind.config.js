// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui"],
      },
      colors: { luxe: { bg: "#0b0f14", gold: "#d4af37", ink: "#e5e7eb" } },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(0,0,0,0.4)",
        glow: "0 0 0 1px rgba(212,175,55,0.28), 0 20px 40px -20px rgba(212,175,55,0.38)",
      },
      keyframes: {
        floaty: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 0 0 rgba(212,175,55,0.25)" },
          "100%": { boxShadow: "0 0 0 12px rgba(212,175,55,0)" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        glow: "glow 2.2s ease-out infinite",
      },
      backgroundImage: {
        "grid-dark":
          "linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)",
      },
      backgroundSize: { grid: "24px 24px" },
    },
  },
  plugins: [require("daisyui")],
  // همه‌ی تم‌های DaisyUI فعال؛ دیگر لازم نیست این فایل را برای تعویض تم ویرایش کنی
  daisyui: { themes: true },
};

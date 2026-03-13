/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      maxWidth: {
        "8xl": "1440px",
      },

      fontFamily: {
        sans: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "var(--font-plus-jakarta)",
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        body: [
          "var(--font-inter)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        fa: [
          "Vazirmatn",
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
      },

      colors: {
        luxe: {
          bg: "#0b0f14",
          gold: "#d4af37",
          ink: "#e5e7eb",
        },
      },

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

  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#1b62a6",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#1b62a6",
        },
      },
    ],
  },
};

// export default {
//   content: ["./index.html", "./src/**/*.{js,jsx}"],
//   theme: {
//     extend: {
//       maxWidth: {
//         "8xl": "1440px",
//       },
//       fontFamily: {
//         display: ["Mundial", "sans-serif"],
//         body: ["Mundial", "sans-serif"],
//         sans: ["Mundial", "sans-serif"],
//       },
//       colors: { luxe: { bg: "#0b0f14", gold: "#d4af37", ink: "#e5e7eb" } },
//       boxShadow: {
//         soft: "0 10px 30px -12px rgba(0,0,0,0.4)",
//         glow: "0 0 0 1px rgba(212,175,55,0.28), 0 20px 40px -20px rgba(212,175,55,0.38)",
//       },
//       keyframes: {
//         floaty: {
//           "0%": { transform: "translateY(0)" },
//           "50%": { transform: "translateY(-10px)" },
//           "100%": { transform: "translateY(0)" },
//         },
//         glow: {
//           "0%": { boxShadow: "0 0 0 0 rgba(212,175,55,0.25)" },
//           "100%": { boxShadow: "0 0 0 12px rgba(212,175,55,0)" },
//         },
//       },
//       animation: {
//         floaty: "floaty 6s ease-in-out infinite",
//         glow: "glow 2.2s ease-out infinite",
//       },
//       backgroundImage: {
//         "grid-dark":
//           "linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)",
//       },
//       backgroundSize: { grid: "24px 24px" },
//     },
//   },
//   plugins: [require("daisyui")],

//   daisyui: { themes: true },
// };

// // tailwind.config.js
// export default {
//   content: ["./index.html", "./src/**/*.{js,jsx}"],
//   theme: {
//     extend: {
//       maxWidth: {
//         "8xl": "1440px",
//       },
//       fontFamily: {
//         display: ["Mundial", "sans-serif"],
//         body: ["Mundial", "sans-serif"],
//         sans: ["Mundial", "sans-serif"],
//       },
//       colors: {
//         luxe: {
//           bg: "#0b0f14",
//           gold: "#d4af37",
//           ink: "#e5e7eb",
//         },
//       },
//       boxShadow: {
//         soft: "0 10px 30px -12px rgba(0,0,0,0.4)",
//         glow: "0 0 0 1px rgba(212,175,55,0.28), 0 20px 40px -20px rgba(212,175,55,0.38)",
//       },
//       keyframes: {
//         floaty: {
//           "0%": { transform: "translateY(0)" },
//           "50%": { transform: "translateY(-10px)" },
//           "100%": { transform: "translateY(0)" },
//         },
//         glow: {
//           "0%": { boxShadow: "0 0 0 0 rgba(212,175,55,0.25)" },
//           "100%": { boxShadow: "0 0 0 12px rgba(212,175,55,0)" },
//         },
//       },
//       animation: {
//         floaty: "floaty 6s ease-in-out infinite",
//         glow: "glow 2.2s ease-out infinite",
//       },
//       backgroundImage: {
//         "grid-dark":
//           "linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)",
//       },
//       backgroundSize: { grid: "24px 24px" },
//     },
//   },
//   plugins: [require("daisyui")],

//   daisyui: {
//     themes: [
//       {
//         mytheme: {
//           primary: "#1b62a6", // 🎨 رنگ آبی جایگزین Primary
//           secondary: "#d4af37", // می‌تونی سلیقه‌ای بزنی
//           accent: "#e5e7eb", // یا بذاری رنگ جوهر
//           neutral: "#0b0f14", // رنگ بک‌گراند تیره
//           "base-100": "#0b0f14", // رنگ پس‌زمینه اصلی
//         },
//       },
//     ],
//   },
// };

// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      maxWidth: {
        "8xl": "1440px",
      },
      fontFamily: {
        display: ["Mundial", "sans-serif"],
        body: ["Mundial", "sans-serif"],
        sans: ["Mundial", "sans-serif"],
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
          primary: "#1b62a6", // ✅ فقط پرایمری تغییر کنه
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#1b62a6", // ✅ تو حالت دارک هم همین رنگ باشه
        },
      },
    ],
  },
};

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "system-ui", "sans-serif"],
      },
      colors: {
        cosmic: {
          900: "#080B14",
          800: "#0F172A",
          700: "#1E293B",
          600: "#334155",
        },
        neon: {
          cyan: "#38BDF8",
          violet: "#818CF8",
          magenta: "#C084FC",
          teal: "#2DD4BF",
        },
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        float: "float 6s ease-in-out infinite",
        twinkle: "twinkle 4s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

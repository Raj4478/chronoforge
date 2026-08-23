import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Corporate Navy & Slate palette.
        ink: {
          dark: "#0B1220",
          light: "#F8FAFC",
        },
        navy: {
          DEFAULT: "#1E3A5F",
          deep: "#16304F",
          soft: "#2B4A73",
        },
        // NOTE: the historical accent.* keys are kept so existing utility classes
        // (text-accent-violet, border-accent-cyan, …) keep working — they now
        // resolve to the professional navy/blue system.
        accent: {
          violet: "#2563EB", // primary accent / links / hovers
          cyan: "#1E3A5F", // secondary (navy)
          indigo: "#1E3A5F",
          purple: "#1E3A5F",
        },
        state: {
          success: "#0F766E",
          warning: "#B45309",
          danger: "#B91C1C",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        // Neutral, professional elevation — no colored glow.
        glow: "0 1px 2px rgba(15,23,42,0.06), 0 10px 24px -14px rgba(15,23,42,0.20)",
        "glow-cyan": "0 1px 2px rgba(15,23,42,0.06), 0 10px 24px -14px rgba(30,58,95,0.22)",
      },
      backgroundImage: {
        // Subtle navy gradient for primary surfaces/buttons — refined, not flashy.
        "brand-gradient": "linear-gradient(135deg, #1E3A5F 0%, #23446C 60%, #2B4A73 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease-out both",
        "pulse-soft": "pulseSoft 1.2s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;

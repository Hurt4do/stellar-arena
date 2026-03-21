import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/features/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "muted-foreground": "rgba(232,242,255,0.62)",
        "panel-1": "#0B1220",
        "panel-2": "#0E1730",
        "border-1": "rgba(255,255,255,0.09)",
        "border-2": "rgba(0,179,212,0.25)",
        "neon-cyan": "#00B3D4",
        "neon-purple": "#B35CFF",
      },
      fontFamily: {
        oxanium: ["var(--font-oxanium)", "sans-serif"],
      },
      boxShadow: {
        neonCyan:
          "0 0 0 1px rgba(0,179,212,0.35), 0 0 28px rgba(0,179,212,0.22)",
        neonPurple:
          "0 0 0 1px rgba(179,92,255,0.35), 0 0 34px rgba(179,92,255,0.18)",
        neonCombo:
          "0 0 0 1px rgba(255,255,255,0.06), 0 0 34px rgba(0,179,212,0.12), 0 0 70px rgba(179,92,255,0.10)",
      },
      borderRadius: {
        xl: "0.75rem",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { opacity: "0.55", filter: "blur(0px)" },
          "50%": { opacity: "1", filter: "blur(0.2px)" },
        },
      },
      animation: {
        glowPulse: "glowPulse 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
};
export default config;

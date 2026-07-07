import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0a0a0a",
          900: "#050505",
          800: "#0c0b0a",
          700: "#141210",
          600: "#1c1916",
        },
        gold: {
          DEFAULT: "#c9a96a",
          50: "#f7efdf",
          100: "#eddcbd",
          200: "#e0c79a",
          300: "#d4b585",
          400: "#c9a96a",
          500: "#b8954f",
          600: "#9a7a3d",
        },
        cream: "#f3ece1",
        sage: "#7c8a5e",
        ruby: "#6b2d3c",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        display: ["var(--font-cinzel)", "Cinzel", "serif"],
        sans: ["var(--font-jost)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.35em",
        wide2: "0.18em",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "slow-zoom": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.12)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-gold": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 1s var(--ease-luxe, cubic-bezier(0.22,1,0.36,1)) both",
        shimmer: "shimmer 6s linear infinite",
        "slow-zoom": "slow-zoom 18s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;

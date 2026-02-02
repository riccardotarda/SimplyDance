import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "deep-purple": "#3D1E6D",
        "vibrant-lilac": "#9B5DE5",
        "electric-yellow": "#FFD700",
        "sticker-white": "#F9F7F1",
      },
      fontFamily: {
        staatliches: ["var(--font-staatliches)", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;

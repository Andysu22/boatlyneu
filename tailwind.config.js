// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#0d9488", light: "#14b8a6" },   // Hauptfarbe
        accent: { DEFAULT: "#f59e0b", light: "#fbbf24" },   // Akzentfarbe
        dark: "#1f2937",                                    // dunkler Hintergrund
      },
      fontFamily: {
        // Inter via next/font
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

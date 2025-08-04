// tailwind.config.js
const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        // font-sans verwendet jetzt unsere Google-Variable
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        brand: { DEFAULT: "#0d9488", light: "#14b8a6" },
        accent: { DEFAULT: "#f59e0b", light: "#fbbf24" },
        // … (deine anderen Tokens)
      },
    },
  },
  plugins: [],
};

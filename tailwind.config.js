/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  safelist: [
    'bg-sky-400',
    'bg-sky-200',
    'text-white',
    'text-sky-900',
    'rounded-full',
  ],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#157aaf', light: '#3ec6e0', dark: '#005076' },
        accent: { DEFAULT: '#fcd581', light: '#fffbe0' },
        coral: '#ee6c4d',
        water: '#a7d7e7',
        navy: '#003049',
        sky: '#e3f6fd',
        white: '#fff',
      },
      boxShadow: {
        marine:
          '0 4px 32px 0 rgba(21,122,175,0.12), 0 1.5px 4px 0 rgba(30,64,175,0.06)',
      },
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
      slideUp: {
        '0%': { opacity: 0, transform: 'translateY(24px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
    },
    animation: {
      fadeIn: 'fadeIn 0.8s cubic-bezier(.46,.03,.52,.96) both',
      slideUp: 'slideUp 0.9s cubic-bezier(.46,.03,.52,.96) both',
    },
  },
  plugins: [],
}

// src/components/Hero.tsx
"use client";

import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="relative pt-14 bg-gradient-to-b from-brand to-transparent">
      <div className="max-w-4xl mx-auto text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Finde dein Traumboot
        </h1>
        <p className="text-lg text-white/80 mb-8">
          Buche einfach online mit flexibler Datumauswahl.
        </p>
        <div className="mx-auto max-w-2xl">
          <SearchBar inHero />
        </div>
      </div>

      {/* Wellen-SVG am unteren Rand */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-20"
        >
          <path
            d="M0,0V46.29c47.66,22,103.24,29.38,158,17.75C243.32,54.55,297.46,1.99,353,0c59-2.17,112.43,37.7,169,49.52,65.36,13.62,127.22-3.4,190-20.15C791.62,8.79,853.09-5.4,916,3.36c43.17,6.37,82.31,28.09,124,37.41,54.23,12.36,104-5.14,156-23.38V0Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  );
}

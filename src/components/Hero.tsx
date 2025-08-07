'use client'
import SearchBar from './SearchBar'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-brand to-sky pt-14">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="mb-4 text-4xl font-extrabold text-white drop-shadow md:text-5xl">
          Finde dein Traumboot am Meer
        </h1>
        <p className="mb-8 text-lg text-white/80">
          Online buchen – direkt am Wasser, egal ob Segel, Motor oder Yacht.
        </p>
        <div className="mx-auto max-w-2xl">
          <SearchBar />
        </div>
      </div>

      {/* Animierte Welle */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="h-20 w-full animate-fadeIn"
        >
          <path
            d="M0,0V46.29c47.66,22,103.24,29.38,158,17.75C243.32,54.55,297.46,1.99,353,0c59-2.17,112.43,37.7,169,49.52,65.36,13.62,127.22-3.4,190-20.15C791.62,8.79,853.09-5.4,916,3.36c43.17,6.37,82.31,28.09,124,37.41,54.23,12.36,104-5.14,156-23.38V0Z"
            fill="#fff"
            className="animate-slideUp"
          />
        </svg>
      </div>
    </section>
  )
}

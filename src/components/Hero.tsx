'use client'

import SearchBar from '@/components/SearchBar'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Hintergrund-Gradient für Light/Dark */}
      <div className="to-sky absolute inset-0 -z-10 bg-gradient-to-b from-brand dark:from-slate-900 dark:to-slate-800" />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="dark:bg-white/15 inline-flex items-center gap-2 rounded-full bg-black/10 px-3 py-1 text-xs font-semibold backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Jetzt neu: Live-Verfügbarkeit
          </span>
          <h1 className="mt-4 bg-gradient-to-b from-[rgb(var(--text))] to-[rgb(var(--text)/0.8)] bg-clip-text text-4xl font-extrabold leading-tight text-transparent md:text-6xl">
            Dein <span className="text-yellow-400">Törn</span> beginnt hier
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[rgb(var(--text-muted))]">
            Yachten, Segler & Motorboote – smart vergleichen, sicher buchen.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-5xl">
          <SearchBar />
        </div>

        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-4 text-[rgb(var(--text-muted))]">
          <span className="text-sm">Verifizierte Anbieter</span>
          <span className="h-1 w-1 rounded-full bg-[rgb(var(--border))]" />
          <span className="text-sm">Transparente Preise</span>
          <span className="h-1 w-1 rounded-full bg-[rgb(var(--border))]" />
          <span className="text-sm">Support am Wochenende</span>
        </div>
      </div>
    </section>
  )
}

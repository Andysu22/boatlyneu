// src/app/ueber-uns/page.tsx
'use client'

import { useEffect, useState } from 'react'
import {
  Ship,
  Anchor,
  ShieldCheck,
  Users2,
  Star,
  Compass,
  Sparkles,
  Waves,
} from 'lucide-react'
import Link from 'next/link'

export default function UeberUnsPage() {
  // mount-flag für sanftes initiales Einblenden
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const features = [
    {
      icon: <Ship className="h-6 w-6" />,
      title: 'Auswahl am Wasser',
      text: 'Von RIB bis Yacht – kuratiert und klar verglichen.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: 'Sicher buchen',
      text: 'Transparente Preise, geprüfte Anbieter und sichere Zahlung.',
    },
    {
      icon: <Users2 className="h-6 w-6" />,
      title: 'Für Crews & Familien',
      text: 'Intuitive Planung für Gruppen – vom Kalendereintrag bis zur Checkliste.',
    },
    {
      icon: <Compass className="h-6 w-6" />,
      title: 'Entdecken',
      text: 'Karten-Suche mit Highlights, Spots & Charterbasen.',
    },
  ]

  const stats = [
    { k: '2.5k+', label: 'Aktive Inserate' },
    { k: '18+', label: 'Länder' },
    { k: '4.8★', label: 'Ø Bewertung' },
    { k: '< 3 Min', label: 'zur Buchung' },
  ]

  return (
    <div className="from-sky/40 min-h-screen bg-gradient-to-b to-white dark:from-slate-900 dark:to-slate-950">
      {/* Hero */}
      <section
        className={[
          'relative overflow-hidden',
          mounted
            ? 'motion-safe:animate-[fadeIn_.6s_ease-out_both]'
            : 'opacity-0',
        ].join(' ')}
      >
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-16 sm:pb-20 sm:pt-20">
          <div className="flex flex-col items-start gap-10 sm:flex-row sm:items-center sm:justify-between">
            <div
              className={[
                'transition-all duration-500',
                mounted
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-2 opacity-0',
              ].join(' ')}
            >
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-cyan-700 shadow dark:bg-slate-900/60 dark:text-cyan-300">
                <Sparkles className="h-4 w-4" />
                Unsere Mission
              </div>
              <h1 className="text-3xl font-extrabold leading-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                Einfach. Sicher.{' '}
                <span className="text-brand">Boote buchen.</span>
              </h1>
              <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
                Boatly bringt dich schneller aufs Wasser. Wir kombinieren
                moderne Produkt-Experience mit der Expertise lokaler
                Vercharterer – fair, transparent und ohne versteckte Fußnoten.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/boote"
                  className="rounded-full bg-brand px-5 py-2.5 font-semibold text-white shadow transition hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand/40"
                >
                  Jetzt Boote entdecken
                </Link>
                <a
                  href="#werte"
                  className="rounded-full border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Warum Boatly?
                </a>
              </div>
            </div>

            <div
              className={[
                'relative mx-auto w-full max-w-sm transition-all duration-500',
                mounted
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-2 opacity-0',
              ].join(' ')}
            >
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className="bg-sky/60 absolute -left-8 -top-8 h-28 w-28 rounded-full blur-2xl dark:bg-sky-400/20" />
                <div className="absolute -bottom-10 -right-8 h-28 w-28 rounded-full bg-brand/50 blur-2xl dark:bg-brand/30" />
                <div className="relative">
                  <div className="bg-sky/40 flex items-center gap-3 rounded-2xl p-3 dark:bg-sky-400/10">
                    <Waves className="h-6 w-6 text-brand" />
                    <div>
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        100% transparente Preise
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Endpreis inkl. Pflichtkosten – immer.
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <Star className="h-6 w-6 text-yellow-500" />
                    <div>
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        Verifizierte Bewertungen
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Nur echte Buchungen zählen.
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <Anchor className="h-6 w-6 text-slate-700 dark:text-slate-200" />
                    <div>
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        Support, der anlegt
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Schnell erreichbar – auch am Wochenende.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Welle unten */}
              <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="mt-4 h-8 w-full"
              >
                <path
                  d="M0,0V46.29c47.66,22,103.24,29.38,158,17.75C243.32,54.55,297.46,1.99,353,0c59-2.17,112.43,37.7,169,49.52,65.36,13.62,127.22-3.4,190-20.15C791.62,8.79,853.09-5.4,916,3.36c43.17,6.37,82.31,28.09,124,37.41,54.23,12.36,104-5.14,156-23.38V0Z"
                  className="fill-white dark:fill-slate-900"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Werte / Features */}
      <section
        id="werte"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 py-10 sm:py-14"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              style={{ transitionDelay: `${i * 60}ms` }}
              className={[
                'group relative overflow-hidden rounded-2xl border p-5 shadow transition-all will-change-transform',
                mounted
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-2 opacity-0',
                'border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-lg',
                'dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800',
              ].join(' ')}
            >
              <div className="bg-sky/40 mb-3 inline-flex rounded-xl p-2 text-brand dark:bg-sky-400/10">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {f.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {f.text}
              </p>
              <div className="absolute -right-8 -top-8 h-16 w-16 rounded-full bg-brand/10 transition group-hover:scale-150 dark:bg-brand/20" />
            </div>
          ))}
        </div>
      </section>

      {/* Kennzahlen */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{ transitionDelay: `${i * 60}ms` }}
              className={[
                'text-center transition-all',
                mounted
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-2 opacity-0',
              ].join(' ')}
            >
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {s.k}
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-20">
        <h2 className="mb-4 text-center text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Häufige Fragen
        </h2>
        <div className="space-y-3">
          {[
            {
              q: 'Wie werden Anbieter geprüft?',
              a: 'Wir verifizieren Dokumente (z. B. Gewerbenachweis), Bootsdaten und Kundenfeedback. Auffälligkeiten führen zu manueller Review.',
            },
            {
              q: 'Wann zahle ich?',
              a: 'Du zahlst erst bei Bestätigung. Bei Stornierungen greifen die Bedingungen des Anbieters – klar sichtbar vor der Buchung.',
            },
            {
              q: 'Brauche ich einen Führerschein?',
              a: 'Hängt vom Boot und Revier ab. Filtere nach „führerscheinfrei“ oder wähle „Mit Skipper“.',
            },
          ].map((item, i) => (
            <details
              key={item.q}
              style={{ transitionDelay: `${i * 40}ms` }}
              className={[
                'overflow-hidden rounded-xl border transition-all open:shadow',
                mounted
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-1 opacity-0',
                'border-slate-200 bg-white',
                'dark:border-slate-800 dark:bg-slate-900',
              ].join(' ')}
            >
              <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                {item.q}
              </summary>
              <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-brand/10 blur-2xl dark:bg-brand/20" />
          <div className="bg-sky/40 absolute -right-10 bottom-0 h-40 w-40 rounded-full blur-2xl dark:bg-sky-400/10" />
          <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                Bereit für den nächsten Törn?
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Finde dein Boot oder sprich mit unserem Team – wir helfen dir
                gern weiter.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/boote"
                className="rounded-full bg-brand px-5 py-2.5 font-semibold text-white shadow transition hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand/40"
              >
                Boote ansehen
              </Link>
              <Link
                href="/kontakt"
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Kontakt
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

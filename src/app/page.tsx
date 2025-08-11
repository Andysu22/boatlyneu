// src/components/Landing.tsx

import type { CSSProperties } from 'react'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import BoatCard from '@/components/BoatCard'
import SearchBar from '@/components/SearchBar'
import Image from 'next/image'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = createServerClient(cookies())
  const { data } = await supabase
    .from('boats')
    .select(
      'id, name, type, price, location, image_url, country, rating, reviews, persons, ps, length, tags',
    )
    .limit(8)
    .order('inserted_at', { ascending: false })

  const boats = (
    data && data.length > 0
      ? data
      : [
          {
            id: '1',
            name: 'Bayliner VR5',
            type: 'Motorboot',
            price: 180,
            location: 'Hamburg',
            country: 'Deutschland',
            image_url:
              'https://images.unsplash.com/photo-1522143049013-2519756a60a2?q=80&w=1600&auto=format&fit=crop',
          },
          {
            id: '2',
            name: 'Bavaria Cruiser 46',
            type: 'Segelboot',
            price: 490,
            location: 'Kiel',
            country: 'Deutschland',
            image_url:
              'https://images.unsplash.com/photo-1493916665398-4ab43bfd2a1d?q=80&w=1600&auto=format&fit=crop',
          },
          {
            id: '3',
            name: 'Zodiac Medline',
            type: 'RIB',
            price: 220,
            location: 'Rostock',
            country: 'Deutschland',
            image_url:
              'https://images.unsplash.com/photo-1520509414578-d9cbf09933a1?q=80&w=1600&auto=format&fit=crop',
          },
          {
            id: '4',
            name: 'Sunseeker Predator',
            type: 'Yacht',
            price: 1200,
            location: 'Split',
            country: 'Kroatien',
            image_url:
              'https://images.unsplash.com/photo-1535083783855-76ae62b280b3?q=80&w=1600&auto=format&fit=crop',
          },
          {
            id: '5',
            name: 'Jeanneau Merry',
            type: 'Motorboot',
            price: 250,
            location: 'Palma',
            country: 'Spanien',
            image_url:
              'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=1600&auto=format&fit=crop',
          },
          {
            id: '6',
            name: 'Dufour 312',
            type: 'Segelboot',
            price: 400,
            location: 'Rügen',
            country: 'Deutschland',
            image_url:
              'https://images.unsplash.com/photo-1473973700931-13c54b3800a7?q=80&w=1600&auto=format&fit=crop',
          },
          {
            id: '7',
            name: 'Axopar 28',
            type: 'Motorboot',
            price: 350,
            location: 'Hvar',
            country: 'Kroatien',
            image_url:
              'https://images.unsplash.com/photo-1544551763-7efabf7c2c7b?q=80&w=1600&auto=format&fit=crop',
          },
          {
            id: '8',
            name: 'Lagoon 42',
            type: 'Katamaran',
            price: 790,
            location: 'Athen',
            country: 'Griechenland',
            image_url:
              'https://images.unsplash.com/photo-1520975922284-4c8a17a9d8b8?q=80&w=1600&auto=format&fit=crop',
          },
        ]
  ) as any[]

  const destinations = [
    {
      name: 'Mallorca',
      image:
        'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1600&auto=format&fit=crop',
    },
    {
      name: 'Kroatien',
      image:
        'https://images.unsplash.com/photo-1563799468487-345d2d68c4f8?q=80&w=1600&auto=format&fit=crop',
    },
    {
      name: 'Griechenland',
      image:
        'https://images.unsplash.com/photo-1549647849-8f98d1e8d63f?q=80&w=1600&auto=format&fit=crop',
    },
    {
      name: 'Rügen',
      image:
        'https://images.unsplash.com/photo-1562176559-090b0b1b35d3?q=80&w=1600&auto=format&fit=crop',
    },
    {
      name: 'Sardinien',
      image:
        'https://images.unsplash.com/photo-1521133573892-e44906baee46?q=80&w=1600&auto=format&fit=crop',
    },
    {
      name: 'Dalmatien',
      image:
        'https://images.unsplash.com/photo-1602867742174-0fbbfdd1a9c0?q=80&w=1600&auto=format&fit=crop',
    },
    {
      name: 'Kykladen',
      image:
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
    },
  ]

  const stats = [
    { k: '2.5k+', label: 'Inserate' },
    { k: '18+', label: 'Länder' },
    { k: '4.8★', label: 'Ø Bewertung' },
    { k: '< 3 Min', label: 'zur Buchung' },
  ]

  return (
    <>
      {/* HERO (ohne instabiles SVG, dark‑ready) */}
      <section className="relative overflow-hidden">
        <div className="to-sky absolute inset-0 -z-10 bg-gradient-to-b from-brand dark:from-slate-900 dark:to-slate-800" />
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 text-white sm:px-6 sm:pb-24 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="bg-white/15 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Jetzt neu: Live‑Verfügbarkeit
            </span>
            <h1 className="mt-4 bg-gradient-to-b from-white to-white/80 bg-clip-text text-4xl font-extrabold leading-tight text-transparent md:text-6xl">
              Dein <span className="text-yellow-300">Törn</span> beginnt hier
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
              Yachten, Segler & Motorboote – smart vergleichen, sicher buchen.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-5xl">
            <SearchBar />
          </div>

          <div className="text-white/85 mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-4">
            <span className="text-sm">Verifizierte Anbieter</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span className="text-sm">Transparente Preise</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span className="text-sm">Support am Wochenende</span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white py-8 dark:bg-slate-900 sm:py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:px-6">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800"
              style={{ animationDelay: `${i * 90}ms` } as CSSProperties}
            >
              <div className="text-2xl font-extrabold text-brand-dark dark:text-white">
                {s.k}
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DESTINATIONS – sanfter Auto‑Scroll */}
      <section className="bg-gray-50 py-12 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-navy text-2xl font-extrabold dark:text-white">
              Beliebte Ziele
            </h2>
            <Link
              href="/boote"
              className="text-sm font-semibold text-brand hover:underline"
            >
              Alle ansehen
            </Link>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-gray-50 to-transparent dark:from-slate-950" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 rotate-180 bg-gradient-to-r from-gray-50 to-transparent dark:from-slate-950" />

            <div className="group -mx-1 flex snap-x gap-4 overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex gap-4">
                {destinations.map((d) => (
                  <Link
                    key={d.name}
                    href={`/search?location=${encodeURIComponent(d.name)}`}
                    className="group/item relative h-48 w-64 shrink-0 snap-start overflow-hidden rounded-2xl"
                  >
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover/item:scale-105"
                      sizes="256px"
                      priority={false}
                    />
                    <div className="from-black/55 absolute inset-0 bg-gradient-to-t via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-slate-900 shadow">
                      {d.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED BOATS */}
      <section className="bg-white py-14 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-navy text-2xl font-extrabold dark:text-white">
              Frisch am Steg
            </h2>
            <Link
              href="/boote"
              className="text-sm font-semibold text-brand hover:underline"
            >
              Mehr Boote
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {boats.map((b, i) => (
              <div
                key={b.id}
                className="opacity-0 [animation:fadeIn_.7s_ease-out_forwards]"
                style={{ animationDelay: `${i * 90}ms` } as CSSProperties}
              >
                <BoatCard boat={b} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-50 py-14 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-navy mb-8 text-center text-2xl font-extrabold dark:text-white">
            So einfach geht’s
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Suchen',
                text: 'Ort & Zeitraum wählen – dank Filter findest du schnell das passende Boot.',
              },
              {
                step: '2',
                title: 'Vergleichen',
                text: 'Transparente Preise & echte Bewertungen helfen bei der Entscheidung.',
              },
              {
                step: '3',
                title: 'Buchen',
                text: 'Anfrage senden oder direkt buchen. Bestätigung & Check‑in Infos per Mail.',
              },
            ].map((it, i) => (
              <div
                key={it.step}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
                style={{ animationDelay: `${i * 100}ms` } as CSSProperties}
              >
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {it.step}
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {it.title}
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {it.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white py-14 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-navy mb-8 text-center text-2xl font-extrabold dark:text-white">
            Erfahrungen
          </h2>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex w-[300%] animate-[testimonial_16s_ease-in-out_infinite]">
              {[
                {
                  name: 'Lena',
                  text: 'In 5 Minuten gebucht – alles super geklappt. Gerne wieder!',
                },
                {
                  name: 'Tom',
                  text: 'Top Auswahl und faire Preise. Die Karten‑Suche ist genial.',
                },
                {
                  name: 'Mira',
                  text: 'Transparente Kosten, schneller Support – sehr empfehlenswert.',
                },
              ].map((t, i) => (
                <figure key={i} className="min-w-full px-2 py-4">
                  <blockquote className="text-center text-[15px] text-slate-700 dark:text-slate-200">
                    {t.text}
                  </blockquote>
                  <figcaption className="mt-3 text-center text-sm font-semibold text-slate-900 dark:text-white">
                    — {t.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-r from-brand to-brand-light py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-white/10 p-8 text-white backdrop-blur md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-extrabold">
                Bereit für den nächsten Törn?
              </h3>
              <p className="mt-1 text-white/90">
                Erstelle kostenlos ein Konto und lege direkt los.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/signup"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand shadow transition hover:bg-slate-100"
              >
                Konto erstellen
              </Link>
              <Link
                href="/boote"
                className="rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Boote entdecken
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

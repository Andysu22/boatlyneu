'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { DayPicker, DateRange } from 'react-day-picker'
import {
  Star,
  MapPin,
  Users as UsersIcon,
  Ruler,
  Zap,
  Sun,
  Music,
  Wifi,
} from 'lucide-react'

type Boat = {
  id: string
  name: string
  location: string
  country: string
  type: string
  price: number
  length: number
  power: number
  capacity: number
  isAvailable: boolean
  images: string[]
  description: string
  amenities: string[]
  rating: number
  ratingCount: number
}

const BOATS: Boat[] = [
  {
    id: '1',
    name: 'Sea Explorer Premium',
    location: 'Mallorca',
    country: 'Spanien',
    type: 'Yacht',
    price: 450,
    length: 15.5,
    power: 350,
    capacity: 8,
    isAvailable: true,
    images: ['/images/boat1.jpg', '/images/boat2.jpg', '/images/boat3.jpg'],
    description:
      'Luxuriöse Yacht mit allem Komfort für unvergessliche Momente auf dem Wasser. Perfekt für Familienausflüge oder romantische Trips.',
    amenities: [
      'GPS Navigation',
      'Klimaanlage',
      'Bluetooth Audio',
      'Sonnendeck',
    ],
    rating: 4.8,
    ratingCount: 12,
  },
]

const AMENITY_ICONS: Record<string, JSX.Element> = {
  'GPS Navigation': <MapPin size={20} />,
  Klimaanlage: <Sun size={20} />,
  'Bluetooth Audio': <Music size={20} />,
  Sonnendeck: <Sun size={20} />,
  WLAN: <Wifi size={20} />,
}

export default function BoatPage() {
  const { id } = useParams()
  const boat = BOATS.find((b) => b.id === id) || BOATS[0]

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)

  const [showCal, setShowCal] = useState(false)
  const [range, setRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  })

  const [guests, setGuests] = useState(1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fafd] via-[#ecf4fc] to-[#e4f0fa] py-4 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
      <div className="mx-auto w-full max-w-3xl px-1 sm:px-2 md:max-w-5xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr] md:gap-10">
          {/* Linke Spalte */}
          <div>
            {/* Galerie */}
            <div className="mb-4 flex w-full flex-col gap-3 rounded-3xl bg-white px-0 pb-3 pt-2 shadow dark:bg-slate-900 dark:shadow-black/20 sm:px-6 sm:pb-6 sm:pt-5">
              {/* Hauptbild */}
              <div
                className="relative mb-2 h-52 w-full cursor-pointer overflow-hidden rounded-2xl sm:h-80"
                onClick={() => {
                  setLightboxIdx(0)
                  setLightboxOpen(true)
                }}
              >
                <Image
                  src={boat.images[0]}
                  alt={boat.name}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  priority
                />
                <span className="absolute bottom-2 right-2 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow dark:bg-slate-800/80 dark:text-slate-200">
                  {boat.images.length} Fotos
                </span>
              </div>
              {/* Thumbnails */}
              <div className="flex justify-center gap-2">
                {boat.images.slice(1).map((img, i) => (
                  <div
                    key={i}
                    className="relative h-16 w-24 cursor-pointer overflow-hidden rounded-xl border-2 border-white shadow hover:border-cyan-400 dark:border-slate-800"
                    onClick={() => {
                      setLightboxIdx(i + 1)
                      setLightboxOpen(true)
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${boat.name} Bild ${i + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Hauptinhalt */}
            <div className="flex w-full flex-col gap-4 rounded-3xl bg-white px-4 py-6 shadow dark:bg-slate-900 dark:shadow-black/20">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100 sm:text-3xl">
                    {boat.name}
                  </h1>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
                    <MapPin className="mr-1 h-4 w-4" />
                    {boat.location}, {boat.country}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-800 dark:bg-slate-800 dark:text-slate-200">
                      {boat.type}
                    </span>
                    {boat.isAvailable && (
                      <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                        Sofort buchbar
                      </span>
                    )}
                  </div>
                </div>
                {/* Bewertung */}
                <div className="mt-2 flex items-center gap-1 sm:mt-0">
                  <Star className="h-5 w-5 fill-current text-yellow-400" />
                  <span className="font-bold text-gray-900 dark:text-slate-100">
                    {boat.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-400 dark:text-slate-400">
                    ({boat.ratingCount})
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="mt-2 flex flex-wrap gap-6 text-base text-gray-600 dark:text-slate-300">
                <span className="flex items-center">
                  <UsersIcon className="mr-1 h-5 w-5" />
                  {boat.capacity} Personen
                </span>
                <span className="flex items-center">
                  <Ruler className="mr-1 h-5 w-5" />
                  {boat.length}m
                </span>
                <span className="flex items-center">
                  <Zap className="mr-1 h-5 w-5" />
                  {boat.power} PS
                </span>
              </div>

              {/* Beschreibung */}
              <div>
                <h3 className="mb-1 font-semibold text-gray-900 dark:text-slate-100">
                  Beschreibung
                </h3>
                <p className="text-gray-700 dark:text-slate-300">
                  {boat.description}
                </p>
              </div>

              {/* Ausstattung */}
              <div>
                <h3 className="mb-1 font-semibold text-gray-900 dark:text-slate-100">
                  Ausstattung
                </h3>
                <div className="flex flex-wrap gap-5 text-gray-700 dark:text-slate-300">
                  {boat.amenities.map((a, i) => (
                    <span key={i} className="flex items-center gap-2">
                      {AMENITY_ICONS[a] || <Sun size={20} />}
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bewertungen */}
              <div className="mt-3 flex flex-col gap-2 rounded-2xl border bg-gray-50 px-4 py-5 dark:border-slate-800 dark:bg-slate-900/60">
                <h3 className="flex items-center gap-1 font-semibold text-gray-900 dark:text-slate-100">
                  <Star className="h-5 w-5 fill-current text-yellow-400" />
                  Bewertungen
                  <span className="ml-2 rounded-full bg-gray-100 px-2 text-sm font-medium dark:bg-slate-800 dark:text-slate-200">
                    {boat.rating.toFixed(1)} ★ ({boat.ratingCount})
                  </span>
                </h3>
                <div className="mt-2 rounded-xl border bg-white p-5 text-center font-medium text-gray-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                  Noch keine Bewertungen
                  <div className="mt-2 text-xs text-gray-400 dark:text-slate-500">
                    Seien Sie der Erste, der dieses Boot bewertet.
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile BookingBox */}
            <div className="mt-4 block md:hidden">
              <BookingBox
                boat={boat}
                range={range}
                setRange={setRange}
                guests={guests}
                setGuests={setGuests}
                showCal={showCal}
                setShowCal={setShowCal}
              />
            </div>
          </div>

          {/* Rechte Spalte */}
          <div className="hidden md:block">
            <div className="sticky top-8">
              <BookingBox
                boat={boat}
                range={range}
                setRange={setRange}
                guests={guests}
                setGuests={setGuests}
                showCal={showCal}
                setShowCal={setShowCal}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Bildergalerie"
        >
          <div
            className="relative mx-auto w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4 z-10 text-2xl text-white hover:text-gray-300"
              onClick={() => setLightboxOpen(false)}
              aria-label="Schließen"
            >
              ×
            </button>
            <Image
              src={boat.images[lightboxIdx]}
              alt={`Bild ${lightboxIdx + 1}`}
              width={1200}
              height={675}
              className="h-auto w-full rounded-2xl"
            />
            <button
              onClick={() =>
                setLightboxIdx(
                  (i) => (i - 1 + boat.images.length) % boat.images.length,
                )
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
              aria-label="Vorheriges Bild"
            >
              ‹
            </button>
            <button
              onClick={() =>
                setLightboxIdx((i) => (i + 1) % boat.images.length)
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
              aria-label="Nächstes Bild"
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* Kalender Modal */}
      {showCal && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50"
          onClick={() => setShowCal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Zeitraum auswählen"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <DayPicker
              mode="range"
              onSelect={(v) =>
                setRange(v ?? { from: undefined, to: undefined })
              }
              numberOfMonths={1}
              pagedNavigation
              fixedWeeks
              required={false}
              className="dark:text-slate-100"
            />
            <button
              onClick={() => setShowCal(false)}
              className="mt-4 w-full rounded-lg bg-brand px-6 py-3 text-white transition hover:bg-brand-light"
            >
              Fertig
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function BookingBox({
  boat,
  range,
  setRange,
  guests,
  setGuests,
  showCal,
  setShowCal,
}: {
  boat: Boat
  range: DateRange
  setRange: (r: DateRange) => void
  guests: number
  setGuests: (n: number) => void
  showCal: boolean
  setShowCal: (b: boolean) => void
}) {
  const priceStr = `€${boat.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`

  return (
    <div className="mb-8 flex w-full flex-col gap-3 rounded-3xl bg-white px-6 py-6 shadow dark:bg-slate-900 dark:shadow-black/20 md:mb-0 md:ml-0 md:mt-0">
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-slate-100">
          {priceStr}
        </span>
        <span className="text-base text-gray-500 dark:text-slate-400">
          /Tag
        </span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-slate-400">
            Check-in
          </label>
          <button
            type="button"
            className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-left text-base text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            onClick={() => setShowCal(true)}
          >
            {range.from ? range.from.toLocaleDateString() : 'tt.mm.jjjj'}
          </button>
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-slate-400">
            Check-out
          </label>
          <button
            type="button"
            className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-left text-base text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            onClick={() => setShowCal(true)}
          >
            {range.to ? range.to.toLocaleDateString() : 'tt.mm.jjjj'}
          </button>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-slate-400">
          Gäste
        </label>
        <select
          className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        >
          {[...Array(boat.capacity)].map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1} {i === 0 ? 'Gast' : 'Gäste'}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-slate-400">
          Nachricht (optional)
        </label>
        <input
          type="text"
          className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          placeholder="Besondere Wünsche oder Fragen..."
        />
      </div>
      <button
        className="w-full rounded-full bg-brand py-3 text-lg font-semibold text-white shadow transition hover:bg-brand-dark"
        disabled
      >
        Jetzt buchen
      </button>
      <div className="mb-1 text-center text-xs text-gray-400 dark:text-slate-500">
        Du wirst noch nicht belastet
      </div>
      <button className="w-full rounded-full border border-gray-200 bg-gray-100 py-2 font-medium text-gray-700 transition hover:bg-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/80">
        Eigentümer kontaktieren
      </button>
    </div>
  )
}

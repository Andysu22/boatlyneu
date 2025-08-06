'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { DayPicker, DateRange } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { Star, MapPin, Users, Ruler, Zap, Sun, Music, Wifi } from 'lucide-react'

// Dummy-Boat-Type für das Beispiel
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
  // weitere Boote...
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

  // Image Modal (Lightbox)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)

  // Kalender
  const [showCal, setShowCal] = useState(false)
  const [range, setRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fafd] via-[#ecf4fc] to-[#e4f0fa] py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 lg:flex-row">
        {/* Linke Seite: Bilder + Text */}
        <div className="min-w-0 flex-1">
          {/* Galerie */}
          <div className="mb-6 flex gap-4">
            <div className="flex-1">
              <div
                className="group relative h-72 cursor-pointer overflow-hidden rounded-2xl"
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
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="group relative h-32 w-36 cursor-pointer overflow-hidden rounded-2xl"
                  onClick={() => {
                    setLightboxIdx(i)
                    setLightboxOpen(true)
                  }}
                >
                  <Image
                    src={boat.images[i]}
                    alt={boat.name}
                    fill
                    className="object-cover transition group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Titel und Location */}
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {boat.name}
            </h1>
            <span className="hidden md:inline-block">
              {boat.isAvailable && (
                <span className="ml-2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                  Sofort buchbar
                </span>
              )}
            </span>
          </div>
          <div className="mb-3 flex items-center text-gray-500">
            <MapPin className="mr-1 h-5 w-5" />
            {boat.location}, {boat.country}
          </div>

          {/* Features */}
          <div className="mb-4 flex flex-wrap gap-6 text-base text-gray-600">
            <span className="flex items-center">
              <Users className="mr-1 h-5 w-5" />
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
            <span className="ml-2 flex items-center text-yellow-500">
              <Star className="mr-1 h-5 w-5 fill-current" />
              <span className="font-bold text-gray-900">
                {boat.rating.toFixed(1)}
              </span>
              <span className="ml-1 text-gray-500">
                ({boat.ratingCount} Bewertungen)
              </span>
            </span>
          </div>
          {/* Boot-Typ + Badge */}
          <div className="mb-5 flex gap-2">
            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-800">
              {boat.type}
            </span>
            {boat.isAvailable && (
              <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                Sofort buchbar
              </span>
            )}
          </div>
          {/* Beschreibung */}
          <div className="mb-7">
            <h3 className="mb-2 font-semibold text-gray-900">Beschreibung</h3>
            <p className="text-gray-700">{boat.description}</p>
          </div>
          {/* Ausstattung */}
          <div className="mb-7">
            <h3 className="mb-2 font-semibold text-gray-900">Ausstattung</h3>
            <div className="flex flex-wrap gap-8 text-gray-700">
              {boat.amenities.map((a, i) => (
                <span key={i} className="flex items-center gap-2">
                  {AMENITY_ICONS[a] || <Sun size={20} />}
                  {a}
                </span>
              ))}
            </div>
          </div>
          {/* Bewertungen */}
          <div className="mb-7">
            <h3 className="mb-3 flex items-center font-semibold text-gray-900">
              <Star className="mr-2 h-5 w-5 fill-current text-yellow-500" />
              Bewertungen
              <span className="ml-2 rounded-full bg-gray-100 px-2 text-sm font-medium">
                {boat.rating.toFixed(1)} ★ ({boat.ratingCount})
              </span>
            </h3>
            <div className="rounded-xl border bg-white p-6 text-center font-medium text-gray-500">
              Noch keine Bewertungen
              <div className="mt-2 text-xs text-gray-400">
                Seien Sie der Erste, der dieses Boot bewertet.
              </div>
            </div>
          </div>
        </div>

        {/* Rechte Seite: Buchungsbox */}
        <aside className="w-full shrink-0 lg:w-[360px]">
          <div className="sticky top-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
            <div className="mb-2 flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">
                €{boat.price.toFixed(2)}
              </span>
              <span className="text-base text-gray-500">/Tag</span>
            </div>
            {/* Kalender/Inputs */}
            <div className="mb-4 flex gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Check-in
                </label>
                <button
                  type="button"
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-left text-base text-gray-900"
                  onClick={() => setShowCal(true)}
                >
                  {range.from ? range.from.toLocaleDateString() : 'tt.mm.jjjj'}
                </button>
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Check-out
                </label>
                <button
                  type="button"
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-left text-base text-gray-900"
                  onClick={() => setShowCal(true)}
                >
                  {range.to ? range.to.toLocaleDateString() : 'tt.mm.jjjj'}
                </button>
              </div>
            </div>
            {/* Gäste */}
            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Gäste
              </label>
              <select className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-gray-900">
                {[...Array(boat.capacity)].map((_, i) => (
                  <option key={i}>
                    {i + 1} {i === 0 ? 'Gast' : 'Gäste'}
                  </option>
                ))}
              </select>
            </div>
            {/* Nachricht */}
            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Nachricht (optional)
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-gray-900"
                placeholder="Besondere Wünsche oder Fragen..."
              />
            </div>
            <button
              className="mb-2 w-full rounded-lg bg-brand py-3 text-lg font-semibold text-white shadow transition hover:bg-brand-dark"
              disabled
            >
              Jetzt buchen
            </button>
            <div className="mb-2 text-center text-xs text-gray-400">
              Du wirst noch nicht belastet
            </div>
            <button className="w-full rounded-lg border border-gray-200 bg-gray-100 py-2 font-medium text-gray-700 transition hover:bg-gray-200">
              Eigentümer kontaktieren
            </button>
          </div>
        </aside>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4 text-2xl text-white hover:text-gray-300"
              onClick={() => setLightboxOpen(false)}
            >
              ×
            </button>
            <Image
              src={boat.images[lightboxIdx]}
              alt={`Bild ${lightboxIdx + 1}`}
              width={1200}
              height={675}
              className="h-auto w-full rounded-lg"
            />
            {/* Navigation */}
            <button
              onClick={() =>
                setLightboxIdx(
                  (i) => (i - 1 + boat.images.length) % boat.images.length,
                )
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
            >
              ‹
            </button>
            <button
              onClick={() =>
                setLightboxIdx((i) => (i + 1) % boat.images.length)
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* Kalender Modal */}
      {showCal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowCal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <DayPicker
              mode="range"
              onSelect={(v) =>
                setRange(v ?? { from: undefined, to: undefined })
              }
              numberOfMonths={2}
              pagedNavigation
              fixedWeeks
              required={false}
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

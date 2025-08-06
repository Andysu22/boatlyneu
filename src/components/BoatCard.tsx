'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Star, MapPin, Users, Zap, Clock } from 'lucide-react'
import { useState } from 'react'

export interface BoatCardProps {
  boat: {
    id: string
    name: string
    location: string | null
    country?: string
    price: number
    image_url: string | null
    rating?: number
    reviews?: number
    available?: boolean
    persons?: number
    ps?: number
    length?: string
    type?: string
  }
  onDetails?: () => void
}

export default function BoatCardNew({ boat, onDetails }: BoatCardProps) {
  // Bild-Array mit Fallbacks
  const idx = (parseInt(boat.id, 10) % 3) + 1
  const fallback = [
    `/images/boat${idx}.jpg`,
    `/images/boat${(idx % 3) + 1}.jpg`,
    `/images/boat${((idx + 1) % 3) + 1}.jpg`,
  ]
  const images = boat.image_url
    ? [boat.image_url, ...fallback.slice(0, 2)]
    : fallback

  const [current, setCurrent] = useState(0)

  // Modernisierte Daten mit Fallbacks
  const rating = typeof boat.rating === 'number' ? boat.rating : 0
  const reviews = typeof boat.reviews === 'number' ? boat.reviews : 0
  const persons = boat.persons || '–'
  const ps = boat.ps || '–'
  const length = boat.length || '–'

  return (
    <div className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl bg-white font-sans shadow-xl transition-all hover:shadow-2xl">
      {/* Badge & Like */}
      <div className="absolute left-4 top-4 z-10">
        {boat.available && (
          <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow">
            Sofort buchbar
          </span>
        )}
      </div>
      <button
        className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow transition hover:bg-gray-50"
        aria-label="Zu Favoriten"
      >
        <Heart size={20} className="text-gray-400" />
      </button>

      {/* Bild(er) mit Slider */}
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={images[current]}
          alt={boat.name}
          fill
          className="object-cover transition"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        {/* Punkt-Indikator, nur wenn mehrere Bilder */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
            {images.map((_, i) => (
              <button
                key={i}
                className={`h-2 w-2 rounded-full transition-colors duration-300 ${i === current ? 'bg-brand' : 'bg-gray-300'}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrent(i)
                }}
                tabIndex={-1}
                aria-label={`Bild ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Inhalt */}
      <div className="px-6 pb-6 pt-4">
        {/* Name & Bewertung in einer Zeile */}
        <div className="mb-1 flex items-center justify-between gap-2">
          <h3 className="text-base font-bold text-gray-800">
            {boat.name || 'Bootsname fehlt'}
          </h3>
          <div className="flex items-center gap-0.5 font-medium text-yellow-500">
            <Star size={16} className="fill-current" />
            <span className="text-sm">
              {rating > 0 ? rating.toFixed(1) : '–'}
            </span>
            {reviews > 0 && (
              <span className="ml-1 text-xs text-gray-400">({reviews})</span>
            )}
          </div>
        </div>
        {/* Ort */}
        <div className="mb-2 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={16} className="mr-1" />
          {boat.location || '–'}
          {boat.country && <span className="ml-1">, {boat.country}</span>}
        </div>
        {/* Features */}
        <div className="mb-3 flex gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Users size={16} />
            {persons} Pers.
          </span>
          <span className="flex items-center gap-1">
            <Zap size={16} />
            {ps} PS
          </span>
          <span className="flex items-center gap-1">
            <Clock size={16} />
            {length}
          </span>
        </div>
        {/* Preis und Button */}
        <div className="mt-3 flex items-end justify-between">
          <div>
            <span className="text-2xl font-bold text-brand">
              {boat.price ? `€${boat.price}` : '–'}
            </span>
            <span className="ml-1 text-sm font-medium text-gray-400">/Tag</span>
          </div>
          <Link
            href={`/boats/${boat.id}`}
            className="flex items-center justify-center rounded-full bg-brand px-5 py-2 text-base font-semibold text-white shadow transition hover:bg-brand-light"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}

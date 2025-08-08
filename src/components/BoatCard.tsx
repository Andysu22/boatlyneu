'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Heart,
  Star,
  MapPin,
  Users,
  Zap,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState, useRef } from 'react'

export interface Boat {
  id: string
  name: string
  type?: string
  price: number
  location: string | null
  image_url: string | null
  images?: string[] | null
  country?: string | null
  rating?: number | null
  reviews?: number | null
  available?: boolean | null
  persons?: number | null
  ps?: number | null
  length?: string | null
  tags?: string[] | null
}

interface BoatCardProps {
  boat: Boat
}

export default function BoatCard({ boat }: BoatCardProps) {
  const [current, setCurrent] = useState(0)
  const [isImageHovered, setIsImageHovered] = useState(false)
  const touchStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const [isFavorite, setIsFavorite] = useState(false)
  const [animateHeart, setAnimateHeart] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  // Bild-Array nur aus echten Daten
  const images =
    boat.images && boat.images.length > 0
      ? boat.images
      : boat.image_url
        ? [boat.image_url]
        : []

  function handleTouchStart(e: React.TouchEvent) {
    const touch = e.changedTouches[0]
    touchStart.current = { x: touch.screenX, y: touch.screenY }
  }
  function goPrev() {
    setCurrent(current > 0 ? current - 1 : images.length - 1)
  }
  function goNext() {
    setCurrent(current < images.length - 1 ? current + 1 : 0)
  }
  function handleTouchEnd(e: React.TouchEvent) {
    const touch = e.changedTouches[0]
    const diffX = touch.screenX - touchStart.current.x
    const diffY = touch.screenY - touchStart.current.y
    if (Math.abs(diffX) > 60 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      if (diffX < 0) goNext()
      if (diffX > 0) goPrev()
    }
  }

  function handleFavorite() {
    setIsFavorite((prev) => !prev)
    setAnimateHeart(true)
    setNotification(
      !isFavorite ? 'Zu Favoriten hinzugefügt' : 'Aus Favoriten entfernt',
    )
    setTimeout(() => setAnimateHeart(false), 400)
    setTimeout(() => setNotification(null), 1500)
  }

  function renderLocation() {
    if (boat.location && boat.country)
      return `${boat.location}, ${boat.country}`
    if (boat.location) return boat.location
    if (boat.country) return boat.country
    return '–'
  }

  return (
    <div className="relative mx-auto my-4 flex w-full max-w-[380px] flex-col overflow-hidden rounded-2xl bg-white font-sans shadow-lg hover:shadow-2xl sm:my-6">
      {notification && (
        <div className="animate-fade-in-out pointer-events-none fixed left-1/2 top-6 z-[9999] -translate-x-1/2 select-none rounded-full bg-gray-900 px-6 py-3 text-base font-semibold text-white shadow-xl">
          {notification}
        </div>
      )}

      {/* Tags aus DB */}
      {boat.tags && boat.tags.length > 0 && (
        <div className="absolute left-4 top-4 z-10 flex flex-col items-start gap-2">
          {boat.tags.map((tag, i) => (
            <span
              key={i}
              className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-white shadow"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Herz */}
      <button
        type="button"
        className="absolute right-4 top-4 z-10 flex items-center justify-center p-1 transition focus:outline-none"
        aria-label="Zu Favoriten"
        onClick={handleFavorite}
        style={{ background: 'transparent' }}
      >
        <Heart
          size={26}
          className={`transition-all duration-200 ${
            isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
          } ${animateHeart ? 'animate-ping-once' : ''}`}
        />
      </button>

      {/* Bild */}
      <div
        className="relative h-56 w-full touch-pan-y select-none overflow-hidden rounded-t-2xl bg-gray-100"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        {images.length > 0 ? (
          <Image
            src={images[current]}
            alt={boat.name}
            fill
            className="object-cover transition"
            sizes="(max-width: 640px) 100vw, 380px"
            priority
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
            Kein Bild
          </div>
        )}

        {isImageHovered && images.length > 1 && (
          <>
            <button
              type="button"
              className="absolute left-2 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 shadow hover:bg-gray-100 focus:outline-none md:flex"
              onClick={goPrev}
              aria-label="Vorheriges Bild"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 shadow hover:bg-gray-100 focus:outline-none md:flex"
              onClick={goNext}
              aria-label="Nächstes Bild"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`h-2 w-2 rounded-full border transition-colors duration-300 ${
                  i === current
                    ? 'border-cyan-600 bg-cyan-500'
                    : 'border-gray-300 bg-gray-300'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrent(i)
                }}
                aria-label={`Bild ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Inhalt */}
      <div className="px-4 pb-5 pt-4 sm:px-6">
        <div className="mb-1 flex items-center justify-between gap-2">
          <h3 className="truncate text-base font-bold leading-tight text-gray-800">
            {boat.name || 'Unbenannt'}
          </h3>
          {boat.rating !== null && boat.rating !== undefined && (
            <div className="flex items-center gap-1 font-semibold">
              <Star size={17} className="fill-yellow-400 text-yellow-400" />
              <span className="text-black-600 text-sm">
                {boat.rating > 0 ? boat.rating.toFixed(1) : '–'}
              </span>
              {boat.reviews && boat.reviews > 0 && (
                <span className="ml-1 text-xs font-bold text-gray-400">
                  ({boat.reviews})
                </span>
              )}
            </div>
          )}
        </div>
        <div className="mb-2 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={16} className="mr-1" />
          {renderLocation()}
        </div>
        <div className="mb-3 flex gap-5 text-sm text-gray-600">
          {boat.persons && (
            <span className="flex items-center gap-1">
              <Users size={16} />
              {boat.persons} Pers.
            </span>
          )}
          {boat.ps && (
            <span className="flex items-center gap-1">
              <Zap size={16} />
              {boat.ps} PS
            </span>
          )}
          {boat.length && (
            <span className="flex items-center gap-1">
              <Clock size={16} />
              {boat.length}
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-800">
              {boat.price ? `€${boat.price}` : '–'}
            </span>
            {boat.price && (
              <span className="ml-1 text-sm font-medium text-gray-400">
                /Tag
              </span>
            )}
          </div>
          <Link
            href={`/boats/${boat.id}`}
            className="flex items-center justify-center rounded-full bg-cyan-500 px-6 py-2 text-base font-semibold text-white shadow transition hover:bg-cyan-600 focus:outline-none"
            style={{ minWidth: 110 }}
          >
            Details
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes ping-once {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.4);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-ping-once {
          animation: ping-once 0.4s cubic-bezier(0.4, 0, 0.6, 1);
        }
        @keyframes fade-in-out {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          20% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          80% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
        }
        .animate-fade-in-out {
          animation: fade-in-out 1.5s both;
        }
      `}</style>
    </div>
  )
}

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
  country?: string
  rating?: number
  reviews?: number
  available?: boolean
  persons?: number
  ps?: number
  length?: string
  tags?: string[]
}

interface BoatCardProps {
  boat: Boat
  onDetails?: () => void
}

export default function BoatCard({ boat, onDetails }: BoatCardProps) {
  // Dummywerte für Demos (du kannst sie in echten Daten ersetzen)
  const demo: Partial<Boat> = {
    rating: 4.8,
    reviews: 12,
    available: true,
    persons: 6,
    ps: 45,
    length: '14m',
    tags: ['Sofort buchbar', 'Top bewertet'],
    country: 'Spanien',
  }
  // Fallbacks
  const rating = typeof boat.rating === 'number' ? boat.rating : demo.rating!
  const reviews =
    typeof boat.reviews === 'number' ? boat.reviews : demo.reviews!
  const persons = boat.persons || demo.persons
  const ps = boat.ps || demo.ps
  const length = boat.length || demo.length
  const tags = boat.tags || demo.tags
  const country = boat.country || demo.country

  // Bild-Handling
  const fallbackImg = [
    '/images/boat1.jpg',
    '/images/boat2.jpg',
    '/images/boat3.jpg',
  ]
  const images = boat.image_url ? [boat.image_url, ...fallbackImg] : fallbackImg

  const [current, setCurrent] = useState(0)
  const [isImageHovered, setIsImageHovered] = useState(false)
  const touchStartX = useRef(0)

  // Favoriten-Handling
  const [isFavorite, setIsFavorite] = useState(false)
  const [animateHeart, setAnimateHeart] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  // Swipen
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.changedTouches[0].screenX
  }
  function goPrev() {
    setCurrent(current > 0 ? current - 1 : images.length - 1)
  }
  function goNext() {
    setCurrent(current < images.length - 1 ? current + 1 : 0)
  }
  function handleTouchEnd(e: React.TouchEvent) {
    const endX = e.changedTouches[0].screenX
    const diff = touchStartX.current - endX
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext()
      if (diff < 0) goPrev()
    }
  }

  // Favoriten-Click
  function handleFavorite() {
    setIsFavorite((prev) => !prev)
    setAnimateHeart(true)
    setNotification(
      !isFavorite ? 'Zu Favoriten hinzugefügt' : 'Aus Favoriten entfernt',
    )
    setTimeout(() => setAnimateHeart(false), 400)
    setTimeout(() => setNotification(null), 1500)
  }

  // Card-Komma-Logik:
  // Ort + (optional) Komma + Land
  function renderLocation() {
    if (boat.location && country) {
      return (
        <>
          {boat.location}
          {','}&nbsp;{country}
        </>
      )
    }
    if (boat.location) return boat.location
    if (country) return country
    return '–'
  }

  return (
    <div className="relative flex w-[380px] flex-col overflow-hidden rounded-2xl bg-white font-sans shadow-lg hover:shadow-2xl">
      {/* Notification */}
      {notification && (
        <div className="animate-fade-in-out pointer-events-none fixed left-1/2 top-6 z-[9999] -translate-x-1/2 select-none rounded-full bg-gray-900 px-6 py-3 text-base font-semibold text-white shadow-xl">
          {notification}
        </div>
      )}
      {/* Tags */}
      <div className="absolute left-4 top-4 z-10 flex flex-col items-start gap-2">
        {tags?.map((tag, i) => (
          <span
            key={i}
            className={`rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow ${
              tag === 'Top bewertet' ? 'bg-yellow-400 text-gray-900' : ''
            } ${tag === 'Luxus' ? 'bg-purple-600' : ''}`}
          >
            {tag}
          </span>
        ))}
      </div>
      {/* Herz */}
      <button
        className="absolute right-4 top-4 z-10 flex items-center justify-center p-1 transition"
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
      {/* Bild(er) */}
      <div
        className="relative h-56 w-full select-none bg-gray-100"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        <Image
          src={images[current]}
          alt={boat.name}
          fill
          className="object-cover transition"
          sizes="(max-width: 768px) 100vw, 410px"
        />
        {/* Swipe-Buttons nur beim Hover über das Bild */}
        {isImageHovered && images.length > 1 && (
          <>
            <button
              className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 shadow hover:bg-gray-100 md:flex"
              onClick={goPrev}
              aria-label="Vorheriges Bild"
              tabIndex={0}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 shadow hover:bg-gray-100 md:flex"
              onClick={goNext}
              aria-label="Nächstes Bild"
              tabIndex={0}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
            {images.map((_, i) => (
              <button
                key={i}
                className={`h-2 w-2 rounded-full border transition-colors duration-300 ${i === current ? 'border-cyan-600 bg-cyan-500' : 'border-gray-300 bg-gray-300'}`}
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
        <div className="mb-1 flex items-center justify-between gap-2">
          <h3 className="truncate text-base font-bold leading-tight text-gray-800">
            {boat.name || 'Bootsname fehlt'}
          </h3>
          <div className="flex items-center gap-1 font-semibold">
            <Star size={17} className="fill-yellow-400 text-yellow-400" />
            <span className="text-black-600 text-sm">
              {rating > 0 ? rating.toFixed(1) : '–'}
            </span>
            {reviews > 0 && (
              <span className="ml-1 text-xs font-bold text-gray-400">
                ({reviews})
              </span>
            )}
          </div>
        </div>
        <div className="mb-2 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={16} className="mr-1" />
          {renderLocation()}
        </div>
        <div className="mb-3 flex gap-5 text-sm text-gray-600">
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
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-800">
              {boat.price ? `€${boat.price}` : '–'}
            </span>
            <span className="ml-1 text-sm font-medium text-gray-400">/Tag</span>
          </div>
          <Link
            href={`/boats/${boat.id}`}
            className="flex items-center justify-center rounded-full bg-cyan-500 px-6 py-2 text-base font-semibold text-white shadow transition hover:bg-cyan-600"
            style={{ minWidth: 110 }}
          >
            Details
          </Link>
        </div>
      </div>
      {/* Herz-Ping Animation */}
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

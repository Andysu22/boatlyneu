// src/components/BoatCard.tsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

export interface Boat {
  id: string;
  name: string;
  type: string | null;
  price: number;
  location: string | null;
  image_url: string | null;
  rating?: number;
}

export default function BoatCard({ boat }: { boat: Boat }) {
  const router = useRouter();

  // Bilder-Array (3 Fallbacks)
  const idx = parseInt(boat.id, 10) % 3 + 1;
  const fallback = [
    `/images/boat${idx}.jpg`,
    `/images/boat${(idx % 3) + 1}.jpg`,
    `/images/boat${((idx + 1) % 3) + 1}.jpg`,
  ];
  const images = boat.image_url ? [boat.image_url, ...fallback.slice(0, 2)] : fallback;

  const [current, setCurrent] = useState(0);

  // Touch-Swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = () => {
    if (
      touchStartX.current !== null &&
      touchEndX.current !== null &&
      Math.abs(touchStartX.current - touchEndX.current) > minSwipeDistance
    ) {
      if (touchStartX.current > touchEndX.current) {
        setCurrent((c) => (c + 1) % images.length);
      } else {
        setCurrent((c) => (c - 1 + images.length) % images.length);
      }
    }
  };

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);
  const rating = boat.rating ?? 4.5;

  return (
    <div
      className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition animate-slideUp cursor-pointer"
      onClick={() => router.push(`/boats/${boat.id}`)}
    >
      {/* Slider */}
      <div
        className="relative h-56 bg-gray-100 group overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-transform duration-500 ease-out ${
              i === current
                ? "translate-x-0"
                : i < current
                ? "-translate-x-full"
                : "translate-x-full"
            }`}
          >
            <Image src={src} alt={boat.name} fill className="object-cover" />
          </div>
        ))}

        {/* Pfeile nur auf Hover, stopPropagation verhindert Card-Navigation */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100 md:flex"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100 md:flex"
        >
          <ChevronRight size={20} />
        </button>

        {/* Punkt-Indikator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i === current ? "bg-brand" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Inhalt */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">{boat.name}</h3>
        <div className="flex items-center space-x-1 text-yellow-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < Math.floor(rating) ? "fill-current" : "text-gray-300"}
            />
          ))}
          <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          {boat.type && (
            <span className="bg-brand-light/20 text-brand px-2 py-0.5 rounded-md">
              {boat.type}
            </span>
          )}
          {boat.location && (
            <span className="flex items-center bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
              <MapPin size={14} className="mr-1" /> {boat.location}
            </span>
          )}
        </div>
        <div className="mt-2 text-brand font-bold">{boat.price} €/Tag</div>
      </div>
    </div>
  );
}

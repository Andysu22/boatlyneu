// src/app/boats/[id]/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  Star,
  MapPin,
  Users,
  Home,
  Bath,
  Music,
  Wifi,
} from "lucide-react";
import type { Boat as BoatCardType } from "@/components/BoatCard";

interface Review {
  id: string;
  name: string;
  avatar_url: string;
  rating: number;
  date: string;
  comment: string;
}

export default function BoatPage() {
  const { id } = useParams();

  // Dummy-Boote
  const sampleBoats: BoatCardType[] = [
    { id: "1", name: "Bayliner VR5", type: "Motorboot", price: 180, location: "Hamburg", image_url: null },
    { id: "2", name: "Bavaria Cruiser 46", type: "Segelboot", price: 490, location: "Kiel", image_url: null },
    { id: "3", name: "Zodiac Medline 580", type: "RIB", price: 220, location: "Rostock", image_url: null },
    { id: "4", name: "Sunseeker Predator", type: "Yacht", price: 1200, location: "München", image_url: null },
  ];
  const boat = sampleBoats.find((b) => b.id === id) ?? sampleBoats[0];

  // Galerie-Bilder
  const idx = (parseInt(boat.id, 10) % 3) + 1;
  const fallback = [
    `/images/boat${idx}.jpg`,
    `/images/boat${(idx % 3) + 1}.jpg`,
    `/images/boat${((idx + 1) % 3) + 1}.jpg`,
  ];
  const images = boat.image_url
    ? [boat.image_url, ...fallback.slice(0, 2)]
    : fallback;

  // Tabs & Reviews
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const reviews: Review[] = [
    { id: "r1", name: "Alice Müller", avatar_url: "/avatar-placeholder.png", rating: 5, date: "2025-07-15", comment: "Tolles Boot, super sauber und einfacher Check-in!" },
    { id: "r2", name: "Boris Schmidt", avatar_url: "/avatar-placeholder.png", rating: 4, date: "2025-06-30", comment: "Schönes Boot, aber etwas kleiner als erwartet." },
    { id: "r3", name: "Clara Weber", avatar_url: "/avatar-placeholder.png", rating: 5, date: "2025-05-20", comment: "Perfekter Tag auf dem Wasser, sehr empfehlenswert!" },
  ];

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const openLightbox = (i: number) => { setLightboxIdx(i); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const prevImage = () => setLightboxIdx((i) => (i - 1 + images.length) % images.length);
  const nextImage = () => setLightboxIdx((i) => (i + 1) % images.length);

  // Calendar Modal State
  const [showCal, setShowCal] = useState(false);
  const [range, setRange] = useState<DateRange>({ from: undefined, to: undefined });

  // Dummy-Ausstattung
  const features = [
    { icon: <Users size={20} />, label: "6 Personen" },
    { icon: <Home size={20} />, label: "2 Kabinen" },
    { icon: <Bath size={20} />, label: "1 Bad" },
    { icon: <Music size={20} />, label: "Stereoanlage" },
    { icon: <Wifi size={20} />, label: "WLAN" },
  ];

  return (
    <div className="pb-24">
      <div className="max-w-7xl mx-auto p-6 space-y-12">
        {/* Galerie & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galerie */}
          <div>
            <div className="relative h-96 rounded-xl overflow-hidden">
              <Image src={images[0]} alt={boat.name} fill className="object-cover" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => openLightbox(i)}
                  className="relative h-24 rounded-lg overflow-hidden focus:outline-none"
                >
                  <Image src={src} alt={boat.name} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">{boat.name}</h1>

            {/* Rating & Location */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={20} className={i < Math.floor(reviews[0].rating) ? "fill-current" : "text-gray-300"} />
                ))}
                <span className="text-gray-600 text-sm">({reviews.length} Bewertungen)</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin size={18} className="mr-1" /> {boat.location}
              </div>
            </div>

            {/* Ausstattung */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {features.map((f, i) => (
                <div key={i} className="flex items-center space-x-2 text-gray-700">
                  {f.icon}
                  <span className="text-sm">{f.label}</span>
                </div>
              ))}
            </div>

            {/* Preis & Buchen */}
            <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="block text-sm text-gray-500 mb-1">Preis pro Tag</span>
                <span className="text-3xl font-bold text-brand">{boat.price} €/Tag</span>
              </div>
              <button className="bg-brand text-white px-8 py-4 rounded-xl text-lg hover:bg-brand-light transition-all duration-200">
                Jetzt buchen
              </button>
            </div>

            {/* Kalender-Button */}
            <div>
              <span className="text-sm text-gray-500 block mb-2">Verfügbarkeit prüfen</span>
              <button
                onClick={() => setShowCal(true)}
                className="w-full sm:w-auto bg-white border border-gray-200 rounded-lg px-4 py-2 shadow hover:shadow-md transition"
              >
                {range.from && range.to
                  ? `${range.from.toLocaleDateString()} – ${range.to.toLocaleDateString()}`
                  : "Datum wählen"}
              </button>
            </div>

            {/* Beschreibung */}
            {activeTab === "details" && (
              <p className="mt-6 text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed suscipit commodo purus, a facilisis nulla consectetur at...
              </p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("details")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "details"
                    ? "border-brand text-brand"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reviews"
                    ? "border-brand text-brand"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Bewertungen
              </button>
            </nav>
          </div>
          {activeTab === "reviews" && (
            <div className="mt-6 space-y-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow">
                  <Image src={rev.avatar_url} alt={rev.name} width={48} height={48} className="rounded-full" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold">{rev.name}</p>
                      <span className="text-sm text-gray-500">{rev.date}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-400 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={16} className={i < rev.rating ? "fill-current" : "text-gray-300"} />
                      ))}
                    </div>
                    <p className="mt-2 text-gray-700">{rev.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 sm:p-8"
    onClick={closeLightbox}
  >
    {/* Wrapper für das Bild */}
    <div
      className="relative w-full max-w-3xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close-Button */}
      <button
        onClick={closeLightbox}
        className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
      >
        ×
      </button>

      {/* Großes Bild */}
      <Image
        src={images[lightboxIdx]}
        alt={`Bild ${lightboxIdx + 1}`}
        width={1200}
        height={675}
        className="w-full h-auto rounded-lg"
      />

      {/* Linker Pfeil */}
      <button
        onClick={prevImage}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/75"
      >
        ‹
      </button>

      {/* Rechter Pfeil */}
      <button
        onClick={nextImage}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/75"
      >
        ›
      </button>
    </div>
  </div>
      )}

      {/* Kalender-Modal */}
      {showCal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <DayPicker
              mode="range"
              selected={range}
              onSelect={(v) => setRange(v ?? { from: undefined, to: undefined })}
              numberOfMonths={2}
              pagedNavigation
              fixedWeeks
              className="react-day-picker rounded-lg overflow-hidden"
              styles={{
                caption:          { fontSize: "1.25rem", fontWeight: 600 },
                head_cell:        { color: "#4A5568" },
                day:              { borderRadius: "0.5rem" },
                day_selected:     { backgroundColor: "var(--tw-color-brand)", color: "white" },
                day_range_middle: { backgroundColor: "rgba(16, 185, 129, 0.2)" },
              }}
            />
            <button
              onClick={() => setShowCal(false)}
              className="mt-4 bg-brand text-white px-6 py-3 rounded-lg w-full hover:bg-brand-light transition"
            >
              Fertig
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

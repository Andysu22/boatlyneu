import Image from "next/image";
import Link from "next/link";
import { Star, MapPin } from "lucide-react";

export interface Boat {
  id: string;
  name: string;
  type: string | null;
  price: number;
  location: string | null;
  image_url: string | null;
  rating?: number; // neue Eigenschaft
}

export default function BoatCard({ boat }: { boat: Boat }) {
  const idx = parseInt(boat.id, 10) % 3 + 1;
  const src = boat.image_url || `/images/boat${idx}.jpg`;
  const rating = boat.rating ?? 4.5; // default

  return (
    <Link
      href={`/boats/${boat.id}`}
      className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition animate-slideUp"
    >
      <div className="relative h-56 group overflow-hidden">
        <Image src={src} alt={boat.name} fill className="object-cover group-hover:scale-105 transition-transform" />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">{boat.name}</h3>

        {/* Rating */}
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

        {/* Tags: Type und Location */}
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

        {/* Preis */}
        <div className="mt-2 text-brand font-bold">{boat.price} €/Tag</div>
      </div>
    </Link>
  );
}

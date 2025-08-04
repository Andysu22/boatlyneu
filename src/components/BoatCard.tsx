import Image from "next/image";
import Link from "next/link";

export interface Boat {
  id: string;
  name: string;
  type: string | null;
  price: number;
  location: string | null;
  image_url: string | null;
}

export default function BoatCard({ boat }: { boat: Boat }) {
  // Drei Platzhalter-Bilder zyklisch verwenden
  const idx = parseInt(boat.id, 10) % 3 + 1;
  const src = boat.image_url || `/images/boat${idx}.jpg`;

  return (
    <Link
      href={`/boats/${boat.id}`}
      className="block bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
    >
      <div className="relative h-48 bg-gray-100">
        <Image src={src} alt={boat.name} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{boat.name}</h3>
        <p className="text-sm text-gray-500">{boat.type}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-teal-600 font-bold">{boat.price} €/Tag</span>
          <span className="text-sm text-gray-600">{boat.location}</span>
        </div>
      </div>
    </Link>
  );
}

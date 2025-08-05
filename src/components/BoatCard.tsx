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
  const idx = parseInt(boat.id, 10) % 3 + 1;
  const src = boat.image_url || `/images/boat${idx}.jpg`;

  return (
    <Link
      href={`/boats/${boat.id}`}
      className="block overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition"
    >
      <div className="relative h-56">
        <Image src={src} alt={boat.name} fill className="object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark/70 to-transparent h-20" />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{boat.name}</h3>
        <p className="text-sm text-gray-500">{boat.type}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-brand font-bold">{boat.price} €/Tag</span>
          <span className="text-sm text-gray-600">{boat.location}</span>
        </div>
      </div>
    </Link>
  );
}

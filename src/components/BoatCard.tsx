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
  return (
    <Link
      href={`/boats/${boat.id}`}
      className="block overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition"
    >
      <div className="relative h-48 bg-gray-200">
        {boat.image_url ? (
          <Image
            src={boat.image_url}
            alt={boat.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Kein Bild
          </div>
        )}
      </div>
      <div className="p-4 bg-white">
        <h3 className="text-lg font-semibold">{boat.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{boat.type}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-brand font-bold">{boat.price} € / Tag</span>
          <span className="text-sm text-gray-600">{boat.location}</span>
        </div>
      </div>
    </Link>
  );
}

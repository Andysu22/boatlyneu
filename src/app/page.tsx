// src/app/page.tsx
import { cookies } from "next/headers";
import { createServerClient } from "@/utils/supabase";
import Hero from "@/components/Hero";
import BoatCard, { Boat } from "@/components/BoatCard";

export default async function HomePage() {
  const supabase = createServerClient(cookies());
  const { data } = await supabase
    .from("boats")
    .select("id, name, type, price, location, image_url")
    .limit(6)
    .order("inserted_at", { ascending: false });

  // Fallback, falls DB leer:
  const sample: Boat[] = [
    { id: "1", name: "Bayliner VR5", type: "Motorboot", price: 180, location: "Hamburg", image_url: null },
    { id: "2", name: "Bavaria Cruiser 46", type: "Segelboot", price: 490, location: "Kiel", image_url: null },
    { id: "3", name: "Zodiac Medline", type: "RIB", price: 220, location: "Rostock", image_url: null },
    { id: "4", name: "Sunseeker Predator", type: "Yacht", price: 1200, location: "München", image_url: null },
    { id: "5", name: "Jeanneau Merry", type: "Motorboot", price: 250, location: "Berlin", image_url: null },
    { id: "6", name: "Dufour 312", type: "Segelboot", price: 400, location: "Rügen", image_url: null },
  ];

  const boats = data && data.length > 0 ? data : sample;

  return (
    <>
      <Hero />
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Beliebte Boote TEST</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {boats.map(b => <BoatCard key={b.id} boat={b} />)}
          </div>
        </div>
      </section>
    </>
  );
}

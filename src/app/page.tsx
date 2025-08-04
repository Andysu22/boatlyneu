// src/app/page.tsx (Server Component)
import { cookies } from "next/headers";
import { createServerClient } from "@/utils/supabase";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import BoatCard, { Boat } from "@/components/BoatCard";

export default async function HomePage() {
  const supabase = createServerClient(cookies());
  const { data, error } = await supabase
    .from("boats")
    .select("id, name, type, price, location, image_url")
    .limit(6)
    .order("inserted_at", { ascending: false });

  const boats: Boat[] = data ?? [];

  return (
    <>
      <Hero />
      <SearchBar />
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Beliebte Boote</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {boats.map((boat) => (
              <BoatCard key={boat.id} boat={boat} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

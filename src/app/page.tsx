// src/app/page.tsx
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import Hero from '@/components/Hero'
import BoatCard from '@/components/BoatCard' // ACHTUNG: Hier keine { ... } mehr!

export default async function HomePage() {
  const supabase = createServerClient(cookies())
  const { data } = await supabase
    .from('boats')
    .select('id, name, type, price, location, image_url')
    .limit(6)
    .order('inserted_at', { ascending: false })

  const sample = [
    {
      id: '1',
      name: 'Bayliner VR5',
      type: 'Motorboot',
      price: 180,
      location: 'Hamburg',
      image_url: null,
    },
    {
      id: '2',
      name: 'Bavaria Cruiser 46',
      type: 'Segelboot',
      price: 490,
      location: 'Kiel',
      image_url: null,
    },
    {
      id: '3',
      name: 'Zodiac Medline',
      type: 'RIB',
      price: 220,
      location: 'Rostock',
      image_url: null,
    },
    {
      id: '4',
      name: 'Sunseeker Predator',
      type: 'Yacht',
      price: 1200,
      location: 'München',
      image_url: null,
    },
    {
      id: '5',
      name: 'Jeanneau Merry',
      type: 'Motorboot',
      price: 250,
      location: 'Berlin',
      image_url: null,
    },
    {
      id: '6',
      name: 'Dufour 312',
      type: 'Segelboot',
      price: 400,
      location: 'Rügen',
      image_url: null,
    },
  ]

  const boats = data && data.length > 0 ? data : sample

  return (
    <>
      <Hero />
      <section className="bg-gray-50 px-4 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-2 sm:grid-cols-2 sm:px-6 md:grid-cols-3">
          {boats.map((b) => (
            <BoatCard key={b.id} boat={b} />
          ))}
        </div>
      </section>
    </>
  )
}

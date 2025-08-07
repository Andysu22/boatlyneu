// src/app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import BoatCard, { Boat } from '@/components/BoatCard'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function DashboardPage() {
  const [kpis] = useState({
    boats: 12,
    bookings: 34,
    revenue: 7520,
  })

  const [boats, setBoats] = useState<Boat[]>([])

  useEffect(() => {
    setBoats([
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
        name: 'Nimbus Seven',
        type: 'Yacht',
        price: 620,
        location: 'Berlin',
        image_url: null,
      },
    ])
  }, [])

  return (
    <div className="min-h-screen space-y-8 bg-slate-50 p-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Dein Dashboard
        </h1>
        <button
          type="button"
          className="flex items-center space-x-2 rounded-lg bg-brand px-4 py-2 text-white transition hover:bg-brand-light"
        >
          <Plus size={18} /> <span>Neues Boot</span>
        </button>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          { label: 'Boote gelistet', value: kpis.boats },
          { label: 'Buchungen gesamt', value: kpis.bookings },
          { label: 'Umsatz (€)', value: kpis.revenue },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-start rounded-2xl bg-white p-6 shadow"
          >
            <span className="text-sm text-gray-500">{stat.label}</span>
            <span className="mt-2 text-3xl font-bold text-brand">
              {stat.value}
            </span>
          </div>
        ))}
      </section>

      {/* Boat Grid */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">
          Deine Boote
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {boats.map((boat) => (
            <BoatCard key={boat.id} boat={boat} />
          ))}
        </div>
      </section>
    </div>
  )
}

export function EmailVerifyStatus() {
  const [verified, setVerified] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = createClientComponentClient()
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user
      setVerified(!!user?.email_confirmed_at)
    })
  }, [])

  if (verified === null) return null
  return (
    <div className="mt-3">
      {verified ? (
        <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-800">
          ✅ E-Mail bestätigt
        </span>
      ) : (
        <span className="rounded-full bg-red-100 px-3 py-1 font-semibold text-red-800">
          ❌ E-Mail nicht bestätigt
        </span>
      )}
    </div>
  )
}

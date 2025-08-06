// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import BoatCard, { Boat } from "@/components/BoatCard";

export default function DashboardPage() {
  // Platzhalter-KPIs (später Supabase-Daten ziehen)
  const [kpis] = useState({
    boats: 12,
    bookings: 34,
    revenue: 7520,
  });

  // Platzhalter-Boote
  const [boats, setBoats] = useState<Boat[]>([]);

  useEffect(() => {
    setBoats([
      { id: "1", name: "Bayliner VR5", type: "Motorboot", price: 180, location: "Hamburg", image_url: null },
      { id: "2", name: "Bavaria Cruiser 46", type: "Segelboot", price: 490, location: "Kiel", image_url: null },
      { id: "3", name: "Zodiac Medline", type: "RIB", price: 220, location: "Rostock", image_url: null },
      { id: "4", name: "Nimbus Seven", type: "Yacht", price: 620, location: "Berlin", image_url: null },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gray-800">Dein Dashboard</h1>
        <button
          type="button"
          className="flex items-center space-x-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-light transition"
        >
          <Plus size={18} /> <span>Neues Boot</span>
        </button>
      </header>

      {/* KPI Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Boote gelistet", value: kpis.boats },
          { label: "Buchungen gesamt", value: kpis.bookings },
          { label: "Umsatz (€)", value: kpis.revenue },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl shadow p-6 flex flex-col items-start"
          >
            <span className="text-sm text-gray-500">{stat.label}</span>
            <span className="mt-2 text-3xl font-bold text-brand">
              {stat.value}
            </span>
          </div>
        ))}
      </section>

      {/* Boats Grid */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Deine Boote
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {boats.map((boat) => (
            <BoatCard key={boat.id} boat={boat} />
          ))}
        </div>
      </section>
    </div>
  );
}

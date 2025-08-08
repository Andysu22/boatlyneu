'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Loader2, AlertCircle, Waves } from 'lucide-react'
import BoatCard, { Boat } from '@/components/BoatCard'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function DashboardPage() {
  const supabase = createClientComponentClient()
  const [boats, setBoats] = useState<Boat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBoats = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data: userData } = await supabase.auth.getUser()
        const userId = userData.user?.id
        if (!userId) {
          setError('Nicht eingeloggt.')
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('boats')
          .select('*')
          .eq('owner', userId)
          .order('inserted_at', { ascending: false })

        if (error) throw error
        setBoats(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadBoats()
  }, [supabase])

  return (
    <div className="from-sky-50 min-h-screen bg-gradient-to-b via-white to-slate-50">
      {/* Hero Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-brand to-brand-light text-white shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 px-6 py-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Waves size={36} className="opacity-90" />
            <h1 className="text-3xl font-extrabold drop-shadow-sm">
              Dein Dashboard
            </h1>
          </div>
          <Link
            href="/dashboard/new-boat"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand shadow-sm transition hover:bg-slate-100"
          >
            <Plus
              size={18}
              className="transition-transform group-hover:rotate-90"
            />
            Neues Inserat
          </Link>
        </div>
      </header>

      {/* Inhalt */}
      <main className="mx-auto w-full max-w-7xl space-y-10 px-6 py-8">
        {/* Status */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-gray-500">
            <Loader2 className="animate-spin mr-2" size={20} /> Lade deine
            Inserate…
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-red-700 shadow-sm">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && boats.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <h2 className="mb-2 text-lg font-semibold text-gray-700">
              Noch keine Inserate
            </h2>
            <p className="mb-4 text-sm text-gray-500">
              Erstelle jetzt dein erstes Boot, um es Besuchern anzuzeigen.
            </p>
            <Link
              href="/dashboard/new-boat"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-light"
            >
              <Plus size={16} /> Inserat erstellen
            </Link>
          </div>
        )}

        {boats.length > 0 && (
          <section>
            <h2 className="mb-6 text-xl font-semibold text-gray-800">
              Deine Inserate
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {boats.map((boat, idx) => (
                <div
                  key={boat.id}
                  className="animate-fadeIn"
                  style={{
                    animationDelay: `${idx * 0.08}s`,
                    animationFillMode: 'both',
                  }}
                >
                  <BoatCard boat={boat} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>
    </div>
  )
}

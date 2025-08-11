'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Plus, Loader2, AlertCircle, Waves, Shield } from 'lucide-react'
import BoatCard, { Boat } from '@/components/BoatCard'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function DashboardPage() {
  const supabase = createClientComponentClient()
  const [boats, setBoats] = useState<Boat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  const busyRef = useRef(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    const load = async () => {
      if (busyRef.current) return
      busyRef.current = true
      setLoading(true)
      setError(null)

      try {
        const { data: userData } = await supabase.auth.getUser()
        const user = userData.user
        if (!user) {
          if (mountedRef.current) {
            setError('Nicht eingeloggt.')
            setBoats([])
            setIsAdmin(false)
          }
          return
        }

        let admin = false
        const { data: prof } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        const metaRole = (
          user.user_metadata?.role as string | undefined
        )?.toLowerCase()
        admin = prof?.role === 'admin' || metaRole === 'admin'
        if (mountedRef.current) setIsAdmin(admin)

        const { data: boatsData, error: boatsError } = await supabase
          .from('boats')
          .select('*')
          .eq('owner', user.id)
          .order('inserted_at', { ascending: false })

        if (boatsError) throw boatsError
        if (mountedRef.current) setBoats(boatsData || [])
      } catch (err: any) {
        if (mountedRef.current) setError(err?.message ?? 'Fehler beim Laden.')
      } finally {
        if (mountedRef.current) setLoading(false)
        busyRef.current = false
      }
    }

    load()
    return () => {
      mountedRef.current = false
    }
  }, [supabase])

  return (
    <div
      className="
        min-h-screen bg-gradient-to-b
        from-sky-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
      "
    >
      {/* Hero Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-brand to-brand-light text-white shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 px-6 py-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Waves size={36} className="opacity-90" />
            <h1 className="text-3xl font-extrabold drop-shadow-sm">
              Dein Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                href="/dashboard/admin"
                className="group inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2.5 text-sm font-semibold text-brand shadow-sm transition hover:bg-white"
              >
                <Shield size={18} className="text-brand" />
                Adminbereich
              </Link>
            )}

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
        </div>
      </header>

      {/* Inhalt */}
      <main className="mx-auto w-full max-w-7xl space-y-10 px-6 py-8">
        {loading && (
          <div className="flex items-center justify-center py-20 text-gray-500 dark:text-slate-400">
            <Loader2 className="mr-2 animate-spin" size={20} /> Lade deine
            Inserate…
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-red-700 shadow-sm dark:bg-red-900/20 dark:text-red-300">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && boats.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-2 text-lg font-semibold text-gray-700 dark:text-slate-200">
              Noch keine Inserate
            </h2>
            <p className="mb-4 text-sm text-gray-500 dark:text-slate-400">
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
            <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-slate-100">
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
    </div>
  )
}

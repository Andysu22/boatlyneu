// src/app/dashboard/admin/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import AdminPanel from '@/components/admin/AdminPanel'
import { Shield } from 'lucide-react'

export default function AdminPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false

    const check = async () => {
      try {
        const { data: uData } = await supabase.auth.getUser()
        const u = uData.user
        if (!u) {
          if (!cancelled) setAllowed(false)
          return
        }

        let profileRole: string | null = null
        const { data: p, error: pErr } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', u.id)
          .single()

        if (!pErr) {
          profileRole = (p?.role ?? null)?.toString().toLowerCase() || null
        }

        const metaRole =
          (u.user_metadata?.role as string | undefined)?.toLowerCase() || null

        const isAdmin = profileRole === 'admin' || metaRole === 'admin'
        if (!cancelled) setAllowed(isAdmin)
      } catch {
        if (!cancelled) setAllowed(false)
      }
    }

    check()
    return () => {
      cancelled = true
    }
  }, [supabase])

  if (allowed === null) {
    return (
      <div className="mx-auto max-w-5xl p-6 text-slate-600 dark:text-slate-300">
        Prüfe Berechtigung…
      </div>
    )
  }

  if (!allowed) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="rounded-xl border bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="font-semibold text-slate-800 dark:text-slate-100">
            Kein Zugriff
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Dieser Bereich ist nur für Admins{' '}
            <button
              onClick={() => router.push('/dashboard')}
              className="text-brand underline underline-offset-2"
            >
              Zurück zum Dashboard
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <header className="mb-6 flex items-center gap-2">
        <Shield className="h-6 w-6 text-brand" />
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Adminbereich
        </h1>
      </header>
      <AdminPanel />
    </div>
  )
}

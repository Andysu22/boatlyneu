// src/app/account/profiles.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  Loader2,
  Save,
  RefreshCcw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'

type ProfileRow = {
  id: string
  firstname: string | null
  lastname: string | null
  email: string | null
  role?: 'user' | 'admin' | null
}

export default function ProfilesPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // form state
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [role, setRole] = useState<'user' | 'admin' | ''>('')

  // initial snapshot für "Abbrechen"
  const initial = useMemo(
    () => ({ firstname, lastname }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const [initialState, setInitialState] = useState<{
    firstname: string
    lastname: string
  }>({
    firstname: '',
    lastname: '',
  })

  // toasts
  const [toasts, setToasts] = useState<
    { id: number; type: 'success' | 'error' | 'info'; msg: string }[]
  >([])
  const pushToast = (type: 'success' | 'error' | 'info', msg: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, type, msg }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }

  useEffect(() => setMounted(true), [])

  // Load current user + profile
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const { data } = await supabase.auth.getUser()
        const u = data.user
        if (!u) {
          if (!cancelled) {
            setLoading(false)
            // Keine Weiterleitung erzwingen – wir zeigen eine einfache „Bitte einloggen“-Karte
          }
          return
        }
        if (!cancelled) {
          setUserId(u.id)
          setUserEmail(u.email ?? null)
        }

        // Profile aus DB
        const { data: p } = await supabase
          .from('profiles')
          .select('id, firstname, lastname, email, role')
          .eq('id', u.id)
          .maybeSingle()

        if (!cancelled) {
          setFirstname(p?.firstname ?? '')
          setLastname(p?.lastname ?? '')
          setRole((p?.role as any as 'user' | 'admin') ?? 'user')
          setInitialState({
            firstname: p?.firstname ?? '',
            lastname: p?.lastname ?? '',
          })
        }
      } catch (e: any) {
        if (!cancelled)
          pushToast(
            'error',
            e?.message || 'Profil konnte nicht geladen werden.',
          )
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [supabase])

  const displayName =
    [firstname, lastname].filter(Boolean).join(' ') || 'Dein Name'
  const initials =
    (firstname?.[0] || '').toUpperCase() +
      (lastname?.[0] || '').toUpperCase() ||
    (userEmail?.[0] || 'U').toUpperCase()

  async function handleSave() {
    if (!userId) {
      pushToast('error', 'Nicht eingeloggt.')
      return
    }
    setSaving(true)
    try {
      // upsert – falls kein Profil existiert
      const { error } = await supabase.from('profiles').upsert(
        {
          id: userId,
          firstname: firstname.trim(),
          lastname: lastname.trim(),
          email: userEmail, // optional synchron halten
          role: role || 'user',
        },
        { onConflict: 'id' },
      )
      if (error) throw error
      setInitialState({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
      })
      pushToast('success', 'Profil gespeichert.')
    } catch (e: any) {
      pushToast('error', e?.message || 'Speichern fehlgeschlagen.')
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    setFirstname(initialState.firstname)
    setLastname(initialState.lastname)
    pushToast('info', 'Änderungen verworfen.')
  }

  // Guards
  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow dark:bg-slate-900/90 dark:text-slate-100">
          <Loader2 className="animate-spin" size={16} />
          Lädt Profil…
        </div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        {/* Toasts */}
        <Toasts toasts={toasts} />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <ShieldCheck className="mx-auto mb-3 text-slate-400" />
          <h2 className="mb-1 text-lg font-bold text-slate-900 dark:text-slate-100">
            Bitte einloggen
          </h2>
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
            Um dein Profil zu bearbeiten, melde dich an.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 font-semibold text-white shadow transition hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand/40"
          >
            Zum Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="from-sky/40 min-h-screen bg-gradient-to-b to-white px-4 py-10 dark:from-slate-900 dark:to-slate-950">
      {/* Toasts */}
      <Toasts toasts={toasts} />

      {/* Header */}
      <section
        className={[
          'mx-auto max-w-4xl',
          mounted
            ? 'motion-safe:animate-[fadeIn_.4s_ease-out_both]'
            : 'opacity-0',
        ].join(' ')}
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand dark:bg-brand/20">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              Profil bearbeiten
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Verwalte deine persönlichen Daten und wie andere dich sehen.
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
          {/* Top banner */}
          <div className="via-sky/20 relative h-24 w-full bg-gradient-to-r from-brand/10 to-transparent dark:from-brand/20 dark:via-sky-400/10">
            <div className="bg-sky/40 absolute -left-10 top-4 h-24 w-24 rounded-full blur-2xl dark:bg-sky-400/20" />
            <div className="absolute -right-10 bottom-0 h-24 w-24 rounded-full bg-brand/20 blur-2xl dark:bg-brand/20" />
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-3">
            {/* Avatar */}
            <div className="sm:col-span-1">
              <div className="relative -mt-14 w-full">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-2xl border border-slate-200 bg-white text-2xl font-extrabold text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                  {initials.slice(0, 2)}
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {displayName}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {userEmail}
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                Avatar-Upload kann ich dir gern nachrüsten (Supabase Storage).
              </p>
            </div>

            {/* Form */}
            <div className="sm:col-span-2">
              <form
                className={[
                  'grid grid-cols-1 gap-4 sm:grid-cols-2',
                  mounted
                    ? 'translate-y-0 opacity-100 transition-all duration-300'
                    : 'translate-y-2 opacity-0',
                ].join(' ')}
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSave()
                }}
              >
                <LabeledInput
                  label="Vorname"
                  value={firstname}
                  onChange={setFirstname}
                  placeholder="z. B. Alex"
                />
                <LabeledInput
                  label="Nachname"
                  value={lastname}
                  onChange={setLastname}
                  placeholder="z. B. Meier"
                />
                <div className="sm:col-span-2">
                  <LabeledInput
                    label="E-Mail"
                    value={userEmail ?? ''}
                    readOnly
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-2 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 font-semibold text-white shadow hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:opacity-60"
                  >
                    {saving ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Save size={16} />
                    )}
                    Speichern
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <RefreshCcw size={16} />
                    Abbrechen
                  </button>
                </div>
              </form>

              {/* kleine Security Box */}
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200">
                <div className="mb-1 font-bold">Sicherheit</div>
                <p className="text-sm">
                  Du möchtest dein Passwort ändern oder die E-Mail
                  aktualisieren? Das läuft über die Anmeldung.{' '}
                  <Link
                    href="/login"
                    className="text-brand underline underline-offset-2"
                  >
                    Hier entlang
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ---------- kleine UI-Bausteine ---------- */

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
}: {
  label: string
  value: string
  onChange?: (v: string) => void
  placeholder?: string
  readOnly?: boolean
}) {
  return (
    <label className="group block">
      <span className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={[
          'w-full rounded-xl border px-3 py-2 text-sm shadow-sm outline-none transition',
          'border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-brand/30',
          'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400',
          readOnly
            ? 'cursor-not-allowed opacity-80'
            : 'group-hover:border-slate-300 dark:group-hover:border-slate-600',
        ].join(' ')}
      />
    </label>
  )
}

function Toasts({
  toasts,
}: {
  toasts: { id: number; type: 'success' | 'error' | 'info'; msg: string }[]
}) {
  return (
    <div className="pointer-events-none fixed left-1/2 top-4 z-[2000] -translate-x-1/2 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            'pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg motion-safe:animate-[fadeIn_.24s_ease-out]',
            t.type === 'success'
              ? 'bg-emerald-600'
              : t.type === 'error'
                ? 'bg-red-600'
                : 'bg-slate-800',
          ].join(' ')}
        >
          {t.type === 'success' && <CheckCircle2 size={18} />}
          {t.type === 'error' && <AlertTriangle size={18} />}
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  )
}

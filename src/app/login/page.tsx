'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserRound,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type Mode = 'login' | 'signup'

export default function AuthPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [mode, setMode] = useState<Mode>('login')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace('/dashboard')
    })
  }, [supabase, router])

  const canSubmit = useMemo(() => {
    if (submitting) return false
    if (!email || !password) return false
    if (mode === 'signup' && (!firstname.trim() || !lastname.trim()))
      return false
    return true
  }, [email, password, mode, firstname, lastname, submitting])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    setOk(null)

    const emailNorm = email.trim().toLowerCase()

    try {
      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: emailNorm,
          password,
        })
        if (signInError) throw signInError
        router.push('/dashboard')
        return
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email: emailNorm,
        password,
        options: {
          data: {
            firstname: firstname.trim(),
            lastname: lastname.trim(),
          },
        },
      })
      if (signUpError) throw signUpError

      setOk(
        'Account erstellt. Bitte bestätige deine E-Mail und melde dich anschließend an.',
      )
    } catch (err: any) {
      setError(err?.message ?? 'Aktion fehlgeschlagen.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <header className="w-full bg-white px-4 py-4 shadow-sm dark:bg-slate-900 sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-extrabold text-brand"
          >
            <ArrowLeft size={18} />
            <span>Zurück</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-8">
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          <div className="hidden rounded-3xl bg-gradient-to-br from-brand to-brand-light p-8 text-white shadow md:block">
            <h2 className="text-3xl font-extrabold drop-shadow-sm">
              Willkommen bei Boatly
            </h2>
            <p className="mt-3 max-w-md text-white/90">
              Schnell registrieren oder anmelden und direkt dein Traumboot
              inserieren oder buchen.
            </p>
            <ul className="mt-6 space-y-2 text-white/95">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={18} /> Sichere Anmeldung
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={18} /> Bestätigungs-Mail wird automatisch
                versendet
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={18} /> Modernes, mobiles UI
              </li>
            </ul>
          </div>

          <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow dark:bg-slate-900 md:p-8">
            <div className="mb-5 grid grid-cols-2 rounded-full border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setError(null)
                  setOk(null)
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow dark:bg-slate-700 dark:text-slate-100'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Anmelden
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup')
                  setError(null)
                  setOk(null)
                }}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow dark:bg-slate-700 dark:text-slate-100'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Registrieren
              </button>
            </div>

            <h1 className="mb-4 text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {mode === 'login' ? 'Melde dich an' : 'Konto erstellen'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Vorname
                    </label>
                    <div className="relative">
                      <input
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        placeholder="Max"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        required
                      />
                      <UserRound
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Nachname
                    </label>
                    <div className="relative">
                      <input
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        placeholder="Mustermann"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        required
                      />
                      <UserRound
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  E-Mail
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="du@example.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    required
                  />
                  <Mail
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Passwort
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    required
                  />
                  <Lock
                    className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700 dark:bg-red-900/20 dark:text-red-300">
                  <AlertTriangle size={16} /> <span>{error}</span>
                </div>
              )}
              {ok && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                  <CheckCircle2 size={16} /> <span>{ok}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 font-semibold text-white shadow disabled:opacity-70"
              >
                {submitting && (
                  <Loader2 className="mr-1 animate-spin" size={18} />
                )}
                {mode === 'login' ? 'Anmelden' : 'Registrieren'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              {mode === 'login' ? 'Noch keinen Account?' : 'Schon registriert?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login')
                  setError(null)
                  setOk(null)
                }}
                className="font-semibold text-brand hover:underline"
              >
                {mode === 'login' ? 'Jetzt registrieren' : 'Jetzt anmelden'}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

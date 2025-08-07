'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)

  // Form states
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (isLogin) {
      // LOGIN
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) return setError(error.message)
      router.push('/dashboard')
    } else {
      // REGISTER
      if (!firstname || !lastname)
        return setError('Bitte Vor- und Nachname angeben.')
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })
      if (signUpError) return setError(signUpError.message)

      // Profile anlegen
      if (data?.user?.id) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          firstname,
          lastname,
          email,
        })
      }
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="w-full bg-white px-6 py-4 shadow-sm">
        <Link
          href="/"
          className="flex items-center space-x-2 font-extrabold text-brand"
        >
          <ArrowLeft size={20} /> <span>Zurück</span>
        </Link>
      </header>

      {/* Main */}
      <main className="flex flex-grow items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md animate-fadeIn rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-extrabold text-gray-800">
            {isLogin ? 'Melde dich an' : 'Erstelle einen Account'}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name only for register */}
            {!isLogin && (
              <div className="flex gap-2">
                <div className="flex flex-1 flex-col">
                  <label
                    htmlFor="firstname"
                    className="mb-1 text-sm font-medium text-gray-700"
                  >
                    Vorname
                  </label>
                  <input
                    id="firstname"
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    required
                    className="rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <label
                    htmlFor="lastname"
                    className="mb-1 text-sm font-medium text-gray-700"
                  >
                    Nachname
                  </label>
                  <input
                    id="lastname"
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                    className="rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>
            )}
            {/* Email */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            {/* Password */}
            <div className="relative flex flex-col">
              <label
                htmlFor="password"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Passwort
              </label>
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="rounded-lg border border-gray-200 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-[2.5rem] text-gray-400 hover:text-gray-600"
              >
                {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {/* Error */}
            {error && (
              <div className="text-center text-sm font-medium text-red-500">
                {error}
              </div>
            )}
            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-brand py-3 font-semibold text-white transition hover:bg-brand-light"
            >
              {isLogin ? 'Anmelden' : 'Registrieren'}
            </button>
          </form>
          {/* Switch */}
          <p className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? 'Noch keinen Account?' : 'Schon registriert?'}{' '}
            <button
              type="button"
              className="font-semibold text-brand hover:underline"
              onClick={() => setIsLogin((v) => !v)}
            >
              {isLogin ? 'Jetzt registrieren' : 'Jetzt anmelden'}
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}

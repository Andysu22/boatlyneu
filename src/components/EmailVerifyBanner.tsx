// src/components/EmailVerifyBanner.tsx
'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

export default function EmailVerifyBanner() {
  const supabase = createClientComponentClient()
  const [ready, setReady] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getUser()
      setShow(!!data.user && !data.user.email_confirmed_at)
      setReady(true)
    }
    run()
    const { data: sub } = supabase.auth.onAuthStateChange(run)
    return () => sub.subscription.unsubscribe()
  }, [supabase])

  if (!ready || !show) return null

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] flex justify-center p-3">
      <div
        className="flex items-center gap-3 rounded-full border px-5 py-2 text-sm font-semibold shadow"
        style={{
          background: 'rgb(var(--brand), .15)',
          color: 'rgb(var(--text))',
          borderColor: 'rgba(var(--border), 1)',
        }}
      >
        <span>
          Deine E-Mail ist noch nicht bestätigt. Bitte prüfe dein Postfach!
        </span>
        <ResendVerification />
      </div>
    </div>
  )
}

function ResendVerification() {
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => setEmail(data.user?.email ?? null))
  }, [supabase])

  const handleResend = async () => {
    if (!email) return
    setLoading(true)
    setMsg('')
    const { error } = await supabase.auth.resend({ type: 'signup', email })
    setLoading(false)
    setMsg(error ? 'Fehler beim Senden!' : 'E-Mail erneut gesendet!')
    setTimeout(() => setMsg(''), 2500)
  }

  return (
    <button
      onClick={handleResend}
      disabled={loading || !email}
      className="rounded-full border px-3 py-1 font-semibold"
      style={{
        borderColor: 'rgb(var(--border))',
        background: 'rgba(var(--card), .9)',
        color: 'rgb(var(--text))',
      }}
    >
      {loading ? 'Sende…' : 'Erneut senden'}{' '}
      {msg && <span className="ml-2 text-xs">{msg}</span>}
    </button>
  )
}

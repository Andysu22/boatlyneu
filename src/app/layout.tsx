// src/app/layout.tsx
'use client'
import '@/app/globals.css'
import { Providers } from '@/components/Providers'
import Header from '@/components/Header'
import { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="bg-gray-50 font-sans text-gray-800 antialiased">
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}

export function EmailVerifyBanner() {
  const [show, setShow] = useState(false)
  const [verified, setVerified] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = createClientComponentClient()
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user
      if (user) {
        setVerified(!!user.email_confirmed_at)
        if (!user.email_confirmed_at) setShow(true)
      }
    })
  }, [])

  if (!show) return null
  return (
    <div className="fixed left-0 right-0 top-0 z-[9999] flex justify-center">
      <div className="mt-4 flex items-center gap-4 rounded-full bg-yellow-100 px-6 py-3 text-center text-yellow-900 shadow">
        <span>
          Deine E-Mail ist noch nicht bestätigt. Bitte prüfe dein Postfach!
        </span>
        {/* Optional: Resend Button */}
        <ResendVerification />
      </div>
    </div>
  )
}

function ResendVerification() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClientComponentClient()
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
    })
  }, [])

  const handleResend = async () => {
    if (!email) {
      setMsg('Keine E-Mail gefunden!')
      return
    }
    setLoading(true)
    setMsg('')
    const supabase = createClientComponentClient()
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email, // garantiert string
    })
    setLoading(false)
    setMsg(error ? 'Fehler beim Senden!' : 'E-Mail erneut gesendet!')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <button
      onClick={handleResend}
      className="ml-2 rounded-full bg-yellow-300 px-4 py-1 font-semibold text-yellow-900 hover:bg-yellow-200"
      disabled={loading || !email}
    >
      {loading ? 'Sende...' : 'Erneut senden'}
      {msg && <span className="ml-2 text-xs">{msg}</span>}
    </button>
  )
}

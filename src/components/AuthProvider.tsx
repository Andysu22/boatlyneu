'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { User } from '@supabase/supabase-js'

type Profile = {
  firstname?: string | null
  lastname?: string | null
  email?: string | null
  role?: string | null
}

type AuthCtx = {
  user: User | null
  profile: Profile | null
  loading: boolean
  refresh: () => Promise<void>
  signOut: () => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

export function useAuth() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAuth must be used within <AuthProvider/>')
  return v
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // nur EIN Ort im ganzen App-Baum holt/abonniert Auth + Profil
  const load = async () => {
    setLoading(true)
    try {
      const { data: authData } = await supabase.auth.getUser()
      const u = authData.user ?? null
      setUser(u)
      if (!u) {
        setProfile(null)
        setLoading(false)
        return
      }
      // minimalen Satz an Spalten holen
      const { data: p, error } = await supabase
        .from('profiles')
        .select('firstname, lastname, email, role')
        .eq('id', u.id)
        .single()
      // Wenn Row fehlt, nicht in Schleife neu anlegen – einfach null lassen
      setProfile(error ? null : (p as Profile))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eine zentrale Subscription – reduziert Event-Stürme
    const { data: sub } = supabase.auth.onAuthStateChange((_e) => {
      // auf Auth-Events gezielt neu laden (debounced durch React-Batching)
      load()
    })
    return () => sub?.subscription?.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const value = useMemo(
    () => ({ user, profile, loading, refresh: load, signOut }),
    [user, profile, loading],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

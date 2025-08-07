'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'
import { ChevronDown, LogOut, UserCircle, LayoutDashboard } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{
    firstname?: string
    lastname?: string
  } | null>(null)
  const [openMenu, setOpenMenu] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Scroll-Shadow-Effect
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // User-State holen & updaten, auch nach Auth-Events!
    const getUserAndProfile = () => {
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user || null)
        if (data.user) {
          supabase
            .from('profiles')
            .select('firstname, lastname')
            .eq('id', data.user.id)
            .single()
            .then(({ data }) => setProfile(data || null))
        }
      })
    }
    getUserAndProfile()
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      getUserAndProfile()
      router.refresh() // Sofort Navbar aktualisieren!
    })
    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setOpenMenu(false)
    window.location.href = '/'
  }

  return (
    <header
      className={`w-full transition-colors ${
        scrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
      style={{ position: 'relative' }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold text-brand">
          Boatly
        </Link>

        {/* Nav */}
        <nav className="hidden space-x-4 md:flex">
          {['Boote', 'Über uns', 'Kontakt'].map((label) => (
            <Link
              key={label}
              href={`/${label.toLowerCase().replace(' ', '')}`}
              className="rounded-full px-3 py-1 text-sm text-slate-700 transition hover:bg-brand-light hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth / User */}
        <div className="relative flex items-center space-x-3">
          {!user ? (
            <>
              <Link
                href="/login"
                className="text-sm text-slate-700 transition hover:text-brand"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-brand-dark px-3 py-1.5 text-sm text-white transition hover:bg-brand"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 font-semibold text-slate-700 shadow transition hover:bg-slate-200 focus:outline-none"
                onClick={() => setOpenMenu((v) => !v)}
                tabIndex={0}
              >
                <UserCircle size={22} className="text-brand" />
                <span>
                  {(profile?.firstname || '') + ' ' + (profile?.lastname || '')}
                </span>
                <ChevronDown size={18} />
              </button>
              {openMenu && (
                <div className="absolute right-0 z-30 mt-2 w-48 animate-fadeIn rounded-xl border bg-white shadow-lg">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-3 text-slate-700 hover:bg-slate-50"
                    onClick={() => setOpenMenu(false)}
                  >
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-3 text-slate-700 hover:bg-slate-50"
                    onClick={() => setOpenMenu(false)}
                  >
                    <UserCircle size={18} /> Profil bearbeiten
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t px-4 py-3 text-red-500 hover:bg-red-50 focus:outline-none"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

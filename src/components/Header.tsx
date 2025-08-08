'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { User } from '@supabase/supabase-js'
import { LayoutDashboard, LogOut, UserCircle2 } from 'lucide-react'

type Profile = { firstname?: string; lastname?: string }

const NAV: Array<{ label: string; href: string }> = [
  { label: 'Boote', href: '/boote' },
  { label: 'Über uns', href: '/ueberuns' },
  { label: 'Kontakt', href: '/kontakt' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [authLoaded, setAuthLoaded] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  // Scroll-Effekt
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Auth & Profil laden + live updaten
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user ?? null)

      if (data.user) {
        const { data: p } = await supabase
          .from('profiles')
          .select('firstname, lastname')
          .eq('id', data.user.id)
          .single()
        setProfile(p ?? null)
      } else {
        setProfile(null)
      }
      setAuthLoaded(true)
    }
    load()
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      load()
      router.refresh()
    })
    return () => sub?.subscription?.unsubscribe()
  }, [router, supabase])

  // Click outside: User-Dropdown
  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  // Body-Scroll sperren bei offenem Mobile-Menü
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setMenuOpen(false)
    setMobileOpen(false)
    router.push('/')
  }

  const initials = (() => {
    const f = profile?.firstname?.[0] ?? ''
    const l = profile?.lastname?.[0] ?? ''
    return (f + l || user?.email?.[0] || 'U').toUpperCase()
  })()

  return (
    <header
      className={[
        'sticky top-0 z-50 transition-all',
        scrolled
          ? 'border-b border-slate-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60'
          : 'bg-white/40 backdrop-blur-sm supports-[backdrop-filter]:bg-white/30',
      ].join(' ')}
      role="banner"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-brand-dark transition-colors hover:text-brand"
          aria-label="Boatly Startseite"
        >
          Boatly
        </Link>

        {/* Center: Nav (md+) */}
        <nav className="hidden md:flex md:items-center md:gap-2">
          {NAV.map((item) => {
            const active = pathname?.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'relative rounded-full px-3 py-2 text-sm font-semibold transition',
                  active
                    ? 'text-brand-dark'
                    : 'text-slate-700 hover:text-brand-dark',
                ].join(' ')}
              >
                <span>{item.label}</span>
                <span
                  className={[
                    'pointer-events-none absolute -bottom-[2px] left-3 right-3 h-[2px] rounded-full',
                    active
                      ? 'bg-gradient-to-r from-brand via-brand-light to-brand'
                      : 'bg-transparent',
                  ].join(' ')}
                />
              </Link>
            )
          })}
        </nav>

        {/* Right: Actions (fixe Breite) */}
        <div className="flex items-center md:w-[200px] md:justify-end">
          {/* Mobile Toggle */}
          <button
            aria-label="Menü umschalten"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
          >
            <span
              className={`burger-line ${mobileOpen ? 'open top' : 'top'}`}
            />
            <span
              className={`burger-line ${mobileOpen ? 'open mid' : 'mid'}`}
            />
            <span
              className={`burger-line ${mobileOpen ? 'open bot' : 'bot'}`}
            />
          </button>

          {/* Auth actions (md+) */}
          <div className="hidden md:flex md:items-center md:gap-3">
            {!authLoaded ? (
              <div
                className="animate-pulse rounded-full bg-slate-200"
                style={{ width: 160, height: 36 }}
              />
            ) : !user ? (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition hover:text-brand"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-brand-dark px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand"
                >
                  Konto erstellen
                </Link>
              </>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 pr-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand font-bold text-white">
                    {initials}
                  </span>
                  <span className="hidden max-w-[110px] truncate sm:block">
                    {(profile?.firstname || '') +
                      ' ' +
                      (profile?.lastname || '')}
                  </span>
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
                  >
                    <div className="px-4 py-3">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {profile?.firstname || profile?.lastname
                          ? `${profile?.firstname ?? ''} ${profile?.lastname ?? ''}`.trim()
                          : user?.email}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {user?.email}
                      </p>
                    </div>
                    <div className="border-t" />
                    <Link
                      href="/dashboard"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-slate-700 hover:bg-slate-50"
                    >
                      <UserCircle2 size={18} />
                      Profil bearbeiten
                    </Link>
                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 border-t px-4 py-3 text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: Fullscreen Slide-Over */}
      <div
        className={`fixed inset-0 z-40 transition-opacity md:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ overflow: 'hidden' }} // kein horizontaler Scroll
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className={[
            'absolute inset-y-0 right-0 w-full bg-white',
            'transition-transform duration-200 ease-out',
            mobileOpen ? 'translate-x-0' : 'translate-x-full',
          ].join(' ')}
        >
          <div className="h-full overflow-y-auto">
            {/* User Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-4">
              {authLoaded && user ? (
                <>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {(profile?.firstname || '') +
                        ' ' +
                        (profile?.lastname || '') || user?.email}
                    </div>
                    <div className="truncate text-xs text-slate-500">
                      {user?.email}
                    </div>
                  </div>
                </>
              ) : (
                <div className="animate-pulse h-8 w-40 rounded-full bg-slate-200" />
              )}
            </div>

            {/* Navigation */}
            <div className="px-5 py-4">
              <nav className="flex flex-col gap-1">
                {NAV.map((item) => {
                  const active = pathname?.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={[
                        'rounded-xl px-3 py-3 text-base font-semibold transition',
                        active
                          ? 'bg-sky text-brand-dark'
                          : 'text-slate-700 hover:bg-slate-100',
                      ].join(' ')}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </nav>

              {/* Auth Buttons */}
              <div className="mt-4 flex flex-col gap-2">
                {!authLoaded ? (
                  <div className="animate-pulse h-10 rounded-xl bg-slate-200" />
                ) : !user ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl bg-brand-dark px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-brand"
                    >
                      Konto erstellen
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-center text-sm font-semibold text-red-600 hover:bg-red-100"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles fürs Burger-Icon */}
      <style jsx>{`
        .burger-line {
          position: absolute;
          width: 20px;
          height: 2px;
          background: currentColor;
          transition:
            transform 0.2s ease,
            opacity 0.15s ease;
        }
        .burger-line.top {
          transform: translateY(-6px);
        }
        .burger-line.mid {
          transform: translateY(0);
        }
        .burger-line.bot {
          transform: translateY(6px);
        }
        .burger-line.open.top {
          transform: translateY(0) rotate(45deg);
        }
        .burger-line.open.mid {
          opacity: 0;
        }
        .burger-line.open.bot {
          transform: translateY(0) rotate(-45deg);
        }
      `}</style>
    </header>
  )
}

'use client'

import Link from 'next/link'
import { createPortal } from 'react-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { User } from '@supabase/supabase-js'
import { useTheme } from 'next-themes'

import {
  LayoutDashboard,
  LogOut,
  UserCircle2,
  Ship,
  Heart,
  CalendarCheck,
  MessageSquare,
  Menu as MenuIcon,
  Sun,
  Moon,
} from 'lucide-react'

type Profile = {
  firstname?: string | null
  lastname?: string | null
  email?: string | null
  role?: string | null
}

const NAV: Array<{ label: string; href: string }> = [
  { label: 'Boote', href: '/' },
  { label: 'Über uns', href: '/ueberuns' },
  { label: 'Kontakt', href: '/kontakt' },
]

function DockLink({
  href,
  label,
  active,
  children,
}: {
  href: string
  label: string
  active?: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={[
        'flex flex-col items-center justify-center gap-1 py-2',
        active
          ? 'text-brand'
          : 'text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white',
      ].join(' ')}
    >
      <span className="h-5 w-5">{children}</span>
      <span className="text-[11px] font-semibold leading-none">{label}</span>
    </Link>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true // SSR: solide Header-BG
    return window.scrollY > 6
  })
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [authLoaded, setAuthLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)

  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const { theme, setTheme, systemTheme } = useTheme()
  const currentTheme = theme === 'system' ? systemTheme : theme
  const [themeReady, setThemeReady] = useState(false)
  useEffect(() => setThemeReady(true), [])

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser()
        const u = authData.user
        setUser(u ?? null)

        if (!u) {
          setProfile(null)
          setAuthLoaded(true)
          return
        }

        const { data: p } = await supabase
          .from('profiles')
          .select('firstname, lastname, email, role')
          .eq('id', u.id)
          .single()

        setProfile(p ?? null)
        setAuthLoaded(true)
      } catch {
        setProfile(null)
        setAuthLoaded(true)
      }
    }

    load()
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      load()
      router.refresh()
    })
    return () => sub?.subscription?.unsubscribe()
  }, [router, supabase])

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = mobileOpen ? 'hidden' : prev || ''
    return () => {
      document.body.style.overflow = prev || ''
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

  const email = user?.email ?? profile?.email ?? ''
  const emailPrefix = email ? email.split('@')[0] : ''
  const displayName =
    profile?.firstname || profile?.lastname
      ? `${profile?.firstname ?? ''} ${profile?.lastname ?? ''}`.trim()
      : (user?.user_metadata?.full_name ??
        user?.user_metadata?.name ??
        emailPrefix)

  const initials = (() => {
    const f = (profile?.firstname ?? '').trim()[0] ?? ''
    const l = (profile?.lastname ?? '').trim()[0] ?? ''
    const fromName = (f + l).toUpperCase()
    return fromName || (emailPrefix[0]?.toUpperCase() ?? 'U')
  })()

  // Mobile Sheet Gesten
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    if (mobileOpen) {
      setEntered(false)
      const id = requestAnimationFrame(() => setEntered(true))
      return () => cancelAnimationFrame(id)
    }
    setEntered(false)
  }, [mobileOpen])

  const dragStartY = useRef(0)
  const dragDelta = useRef(0)
  const [dragging, setDragging] = useState(false)
  const [dragY, setDragY] = useState(0)
  const CLOSE_THRESHOLD = 80

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setDragging(true)
    dragStartY.current = e.touches[0].clientY
    dragDelta.current = 0
    setDragY(0)
  }, [])
  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!dragging) return
      const y = e.touches[0].clientY
      const delta = y - dragStartY.current
      if (delta > 0) {
        dragDelta.current = delta
        setDragY(Math.min(delta, 150))
      }
    },
    [dragging],
  )
  const closeSheet = useCallback(() => {
    setDragging(false)
    setEntered(false)
    setTimeout(() => setMobileOpen(false), 260)
  }, [])
  const onTouchEnd = useCallback(() => {
    if (!dragging) return
    const shouldClose = dragDelta.current > CLOSE_THRESHOLD
    if (shouldClose) closeSheet()
    else {
      setDragging(false)
      setDragY(0)
    }
  }, [dragging, closeSheet])

  return (
    <header
      className={[
        'sticky top-0 z-50 transition-all',
        // Basis: solide Karte (kein transparentes Blending = kein Flash)
        'border-b border-[rgb(var(--border))] bg-[rgb(var(--card))]',
        scrolled ? 'shadow-sm' : '',
      ].join(' ')}
      role="banner"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-brand-dark transition-colors hover:text-brand dark:text-white"
          aria-label="Boatly Startseite"
        >
          Boatly
        </Link>

        {/* Desktop Nav */}
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
                    ? 'text-brand-dark dark:text-white'
                    : 'text-slate-700 hover:text-brand-dark dark:text-slate-300 dark:hover:text-white',
                ].join(' ')}
              >
                <span>{item.label}</span>
                {active && (
                  <span className="pointer-events-none absolute -bottom-[2px] left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-brand via-brand-light to-brand" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Desktop: Theme + Auth */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            aria-label="Theme umschalten"
            onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            title="Hell/Dunkel"
          >
            {themeReady ? (
              currentTheme === 'dark' ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )
            ) : (
              // Platzhalter hält das Layout stabil, kein SVG => kein Hydration-Diff
              <span className="block h-4 w-4" />
            )}
          </button>

          {!authLoaded ? (
            <div className="h-9 w-40 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          ) : !user ? (
            <>
              <Link
                href="/login"
                className="rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition hover:text-brand dark:text-slate-300 dark:hover:text-white"
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
                className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 pr-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand font-bold text-white">
                  {initials}
                </span>
                <span className="hidden max-w-[130px] truncate lg:block">
                  {displayName}
                </span>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="px-4 py-3">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {displayName}
                    </p>
                    {email && displayName !== email && (
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {email}
                      </p>
                    )}
                  </div>
                  <div className="border-t dark:border-slate-700" />
                  <Link
                    href="/dashboard"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/60"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/60"
                  >
                    <UserCircle2 size={18} />
                    Profil bearbeiten
                  </Link>
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t px-4 py-3 text-red-600 hover:bg-red-50 dark:border-slate-700 dark:text-red-400 dark:hover:bg-red-500/10"
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

      {/* Mobile Dock */}
      {mounted &&
        createPortal(
          <nav
            className="fixed inset-x-0 bottom-0 z-[900] border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 md:hidden"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom),8px)' }}
            aria-label="Mobile Navigation"
          >
            <div className="mx-auto grid max-w-7xl grid-cols-5 items-center px-3">
              <DockLink
                href={user ? '/profile' : '/login'}
                label={user ? 'Profil' : 'Login'}
                active={
                  pathname?.startsWith('/profile') ||
                  pathname?.startsWith('/dashboard')
                }
              >
                {user ? (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white">
                    {initials}
                  </span>
                ) : (
                  <MessageSquare className="h-5 w-5" />
                )}
              </DockLink>

              <DockLink
                href="/boote"
                label="Boote"
                active={pathname?.startsWith('/boote')}
              >
                <Ship className="h-5 w-5" />
              </DockLink>

              <DockLink
                href="/favoriten"
                label="Merkliste"
                active={pathname?.startsWith('/favoriten')}
              >
                <Heart className="h-5 w-5" />
              </DockLink>

              <DockLink
                href="/reisen"
                label="Reisen"
                active={pathname?.startsWith('/reisen')}
              >
                <CalendarCheck className="h-5 w-5" />
              </DockLink>

              <button
                onClick={() => setMobileOpen(true)}
                className="flex flex-col items-center justify-center gap-1 py-2 text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"
                aria-label="Menü öffnen"
              >
                <MenuIcon className="h-5 w-5" />
                <span className="text-[11px] font-semibold leading-none">
                  Menü
                </span>
              </button>
            </div>
          </nav>,
          document.body,
        )}

      {/* Mobile Bottom Sheet */}
      {mounted &&
        mobileOpen &&
        createPortal(
          <div className="fixed inset-0 z-[1000] md:hidden">
            <button
              aria-label="Backdrop schließen"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-black/40"
            />
            <div
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              className={[
                'absolute inset-x-0 bottom-0 h-[55svh] max-h-[85svh] min-h-[360px] overflow-hidden rounded-t-2xl border-t border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900',
                'overscroll-contain transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform',
                entered && !dragging ? 'translate-y-0' : 'translate-y-full',
              ].join(' ')}
              style={{
                transform: dragging ? `translateY(${dragY}px)` : undefined,
              }}
            >
              <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-slate-300 dark:bg-slate-600" />

              <div className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  {authLoaded && user ? (
                    <>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                        {initials}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {displayName}
                        </div>
                        {email && displayName !== email && (
                          <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {email}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="h-8 w-40 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
                  )}
                </div>

                <button
                  aria-label="Theme umschalten"
                  onClick={() =>
                    setTheme(currentTheme === 'dark' ? 'light' : 'dark')
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {currentTheme === 'dark' ? (
                    <Sun size={18} />
                  ) : (
                    <Moon size={18} />
                  )}
                </button>
              </div>

              <div className="flex h-[calc(55svh-3.5rem-24px)] flex-col overflow-y-auto px-5 pb-4 pt-2">
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700/60"
                  >
                    <span className="flex items-center gap-3">
                      <LayoutDashboard className="h-5 w-5 text-brand" />
                      Dashboard
                    </span>
                    <span>›</span>
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700/60"
                  >
                    <span className="flex items-center gap-3">
                      <UserCircle2 className="h-5 w-5 text-brand" />
                      Profil anzeigen
                    </span>
                    <span>›</span>
                  </Link>
                </div>

                <div className="mt-3 grid gap-2">
                  {NAV.map((item) => {
                    const active = pathname?.startsWith(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={[
                          'flex items-center justify-between rounded-xl px-4 py-3 font-semibold',
                          active
                            ? 'bg-brand text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
                        ].join(' ')}
                      >
                        <span>{item.label}</span>
                        <span>›</span>
                      </Link>
                    )
                  })}
                </div>

                <div className="mt-4">
                  {!authLoaded ? (
                    <div className="h-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
                  ) : user ? (
                    <button
                      onClick={async () => {
                        await handleLogout()
                        setMobileOpen(false)
                      }}
                      className="w-full rounded-xl bg-red-50 px-4 py-2.5 text-center text-sm font-semibold text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      Logout
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
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
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      <style jsx>{`
        .burger-line {
          position: absolute;
          width: 20px;
          height: 2px;
          background: currentColor;
          transition:
            transform 0.25s ease,
            opacity 0.2s ease;
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

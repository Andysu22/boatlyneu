'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

        {/* Auth */}
        <div className="flex items-center space-x-3">
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
        </div>
      </div>
    </header>
  )
}

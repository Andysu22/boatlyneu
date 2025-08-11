// src/app/not-found.tsx
'use client'

import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center dark:bg-slate-950">
      <h1 className="mb-4 text-6xl font-bold text-gray-800 dark:text-slate-100">
        404
      </h1>
      <p className="mb-6 text-lg text-gray-600 dark:text-slate-400">
        Die von dir gesuchte Seite konnte nicht gefunden werden.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-white shadow hover:bg-brand-light"
      >
        <Home size={20} />
        Zur Startseite
      </Link>
    </main>
  )
}

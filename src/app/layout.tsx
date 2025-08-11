// src/app/layout.tsx
import '@/app/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from '@/components/Providers'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Boatly',
  description:
    'Yachten, Segler & Motorboote – smart vergleichen, sicher buchen.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" suppressHydrationWarning className={inter.variable}>
      {/* KEINE festen bg-/text-Klassen auf dem Body */}
      <body className="overflow-x-hidden pb-[calc(env(safe-area-inset-bottom)+56px)] font-sans antialiased md:pb-0">
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}

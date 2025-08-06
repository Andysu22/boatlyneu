'use client'
import NextTopLoader from 'nextjs-toploader'
import { ReactNode } from 'react'
import { LoadScript } from '@react-google-maps/api'

;<LoadScript
  googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
  libraries={['places']}
>
  {/* ...deine App... */}
</LoadScript>

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <NextTopLoader color="#0d9488" height={3} />
      {children}
    </>
  )
}

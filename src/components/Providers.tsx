'use client'

import { ReactNode, useEffect } from 'react'
import NextTopLoader from 'nextjs-toploader'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'

/**
 * Synchronisiert das native CSS color-scheme mit dem aktiven Theme
 * -> Scrollbars, Form Controls etc. passen sich sofort an
 */
function ColorSchemeSync() {
  const { resolvedTheme } = useTheme()
  useEffect(() => {
    document.documentElement.style.colorScheme =
      resolvedTheme === 'dark' ? 'dark' : 'light'
  }, [resolvedTheme])
  return null
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="boatly-theme"
    >
      <ColorSchemeSync />
      <NextTopLoader color="#0d9488" height={3} showSpinner={false} />
      {children}
    </NextThemesProvider>
  )
}

export default Providers

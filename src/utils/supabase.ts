// src/utils/supabase.ts
import {
  createBrowserClient as browserClient,
  createServerClient as serverClient,
  type CookieOptions,
} from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import type { Database } from './supabase.types';   // <-- Type-Defs 💪

// ---------- Browser (Client Component) ----------
export const createBrowserClient = () =>
  browserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

// ---------- Server Component / Route Handler ----------
export const createServerClient = (cookieStore: ReturnType<typeof cookies>) =>
  serverClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Wird von einem Server Component aus aufgerufen (kein Set möglich) –
            // kann ignoriert werden, wenn die Session per Middleware refreshed wird.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Gleiches Szenario wie oben – kann ignoriert werden.
          }
        },
      },
    },
  );

// ---------- Middleware Client ----------
export const createMiddlewareClient = (request: NextRequest) => {
  // Unveränderte Response anlegen
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = serverClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Cookie in Request *und* Response aktualisieren
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    },
  );

  return { supabase, response };
};

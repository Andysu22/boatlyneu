// src/app/auth/signout/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies })
  await supabase.auth.signOut()
  // Antwort ohne Session-Cookies
  return NextResponse.json({ ok: true })
}

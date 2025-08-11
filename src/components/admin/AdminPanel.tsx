// src/components/admin/AdminPanel.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  RefreshCcw,
  Trash2,
  Pencil,
  Save,
  Search,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Shield,
} from 'lucide-react'

type Boat = {
  id: string
  name: string | null
  type: string | null
  price: number | null
  location: string | null
  country: string | null
  owner: string | null
  image_url: string | null
  inserted_at?: string | null
}

type Profile = {
  id: string
  firstname: string | null
  lastname: string | null
  email: string | null
  role: 'user' | 'admin'
  created_at?: string | null
}

type EditState =
  | { table: 'boats'; row: Partial<Boat> & { id: string } }
  | { table: 'profiles'; row: Partial<Profile> & { id: string } }
  | null

type ConfirmState =
  | { open: true; table: 'boats' | 'profiles'; id: string; label: string }
  | { open: false }

type Toast = { id: number; type: 'success' | 'error' | 'info'; message: string }

export default function AdminPanel() {
  const supabase = createClientComponentClient()

  // -------- Admin‑Gate --------
  const [authLoading, setAuthLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser()
      const user = data.user
      if (!user) {
        setIsAdmin(false)
        setAuthLoading(false)
        return
      }
      const { data: prof } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      setIsAdmin(prof?.role === 'admin')
      setAuthLoading(false)
    }
    check()
  }, [supabase])

  // Tabs
  const [tab, setTab] = useState<'boats' | 'profiles'>('boats')

  // Daten
  const [boats, setBoats] = useState<Boat[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)

  // Suche / Sort
  const [boatQueryInput, setBoatQueryInput] = useState('')
  const [boatSort, setBoatSort] = useState<
    'inserted_at.desc' | 'price.asc' | 'price.desc'
  >('inserted_at.desc')
  const [profileQueryInput, setProfileQueryInput] = useState('')
  const [profileSort, setProfileSort] = useState<
    'created_at.desc' | 'firstname.asc' | 'lastname.asc'
  >('created_at.desc')

  // Pagination
  const [boatPage, setBoatPage] = useState(1)
  const [profilePage, setProfilePage] = useState(1)
  const [boatTotal, setBoatTotal] = useState(0)
  const [profileTotal, setProfileTotal] = useState(0)
  const [pageSize, setPageSize] = useState(10) // Default 10; Auswahl: 5/10/20/50

  const boatTotalPages = useMemo(
    () => Math.max(1, Math.ceil(boatTotal / pageSize)),
    [boatTotal, pageSize],
  )
  const profileTotalPages = useMemo(
    () => Math.max(1, Math.ceil(profileTotal / pageSize)),
    [profileTotal, pageSize],
  )

  // Edit / Confirm / Toasts
  const [edit, setEdit] = useState<EditState>(null)
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState<ConfirmState>({ open: false })
  const [countdown, setCountdown] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const pushToast = (t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, ...t }])
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 2800)
  }

  // ---------- Loader ----------
  async function loadBoats({
    page = boatPage,
    query = boatQueryInput,
    sort = boatSort,
  }: {
    page?: number
    query?: string
    sort?: 'inserted_at.desc' | 'price.asc' | 'price.desc'
  }) {
    if (!isAdmin) return
    setLoading(true)

    const [col, dir] = sort.split('.') as [string, 'asc' | 'desc']

    let q = supabase
      .from('boats')
      .select('*', { count: 'exact' })
      .order(col, { ascending: dir === 'asc' })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (query.trim()) {
      const like = `%${query.trim()}%`
      q = q.or(
        `name.ilike.${like},type.ilike.${like},location.ilike.${like},country.ilike.${like}`,
      )
    }

    const { data, error, count } = await q
    if (error) {
      pushToast({ type: 'error', message: `Boote laden: ${error.message}` })
    } else {
      setBoatTotal(count ?? 0)
      setBoats(data ?? [])
    }
    setLoading(false)
  }

  async function loadProfiles({
    page = profilePage,
    query = profileQueryInput,
    sort = profileSort,
  }: {
    page?: number
    query?: string
    sort?: 'created_at.desc' | 'firstname.asc' | 'lastname.asc'
  }) {
    if (!isAdmin) return
    setLoading(true)

    const [col, dir] = sort.split('.') as [string, 'asc' | 'desc']

    let q = supabase
      .from('profiles')
      .select('id, firstname, lastname, email, role, created_at', {
        count: 'exact',
      })
      .order(col, { ascending: dir === 'asc' })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (query.trim()) {
      const like = `%${query.trim()}%`
      q = q.or(
        `email.ilike.${like},firstname.ilike.${like},lastname.ilike.${like}`,
      )
    }

    const { data, error, count } = await q
    if (error) {
      pushToast({ type: 'error', message: `Profile laden: ${error.message}` })
    } else {
      setProfileTotal(count ?? 0)
      setProfiles(data ?? [])
    }
    setLoading(false)
  }

  // Init
  useEffect(() => {
    if (!isAdmin) return
    setBoatPage(1)
    setProfilePage(1)
    loadBoats({ page: 1 })
    loadProfiles({ page: 1 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin])

  // Sort & PageSize changes -> Seite 1 + neu laden
  useEffect(() => {
    if (!isAdmin) return
    setBoatPage(1)
    loadBoats({ page: 1 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boatSort, pageSize])

  useEffect(() => {
    if (!isAdmin) return
    setProfilePage(1)
    loadProfiles({ page: 1 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileSort, pageSize])

  // Suche (Button/Enter)
  const handleBoatSearch = async () => {
    setBoatPage(1)
    await loadBoats({ page: 1 })
  }
  const handleBoatReset = async () => {
    setBoatQueryInput('')
    setBoatPage(1)
    await loadBoats({ page: 1, query: '' })
  }
  const handleProfileSearch = async () => {
    setProfilePage(1)
    await loadProfiles({ page: 1 })
  }
  const handleProfileReset = async () => {
    setProfileQueryInput('')
    setProfilePage(1)
    await loadProfiles({ page: 1, query: '' })
  }

  // Confirm dialog
  function openConfirm(table: 'boats' | 'profiles', id: string, label: string) {
    setConfirm({ open: true, table, id, label })
    setCountdown(3)
  }
  useEffect(() => {
    if (!confirm.open || countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [confirm.open, countdown])

  async function performDelete() {
    if (!confirm.open) return
    setDeleting(true)
    const { table, id } = confirm
    const { error } = await supabase.from(table).delete().eq('id', id)
    setDeleting(false)
    if (error)
      pushToast({
        type: 'error',
        message: `Löschen fehlgeschlagen: ${error.message}`,
      })
    else {
      pushToast({ type: 'success', message: 'Eintrag gelöscht.' })
      if (table === 'boats') loadBoats({ page: 1 })
      else loadProfiles({ page: 1 })
    }
    setConfirm({ open: false })
  }

  // Save edit
  async function saveEdit() {
    if (!edit) return
    setSaving(true)
    const { table, row } = edit
    const { id, ...rest } = row
    const { error } = await supabase.from(table).update(rest).eq('id', id)
    setSaving(false)
    if (error) pushToast({ type: 'error', message: error.message })
    else {
      setEdit(null)
      pushToast({ type: 'success', message: 'Änderungen gespeichert.' })
      if (table === 'boats') loadBoats({ page: boatPage })
      else loadProfiles({ page: profilePage })
    }
  }

  // -------- Render Guards --------
  if (authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow dark:bg-slate-900/90 dark:text-slate-100">
          <Loader2 className="animate-spin" size={16} />
          Prüfe Berechtigungen…
        </div>
      </div>
    )
  }
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Shield className="mx-auto mb-3 text-slate-400" />
          <h2 className="mb-1 text-lg font-bold text-slate-900 dark:text-slate-100">
            Kein Zugriff
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Dieser Bereich ist nur für Administratoren.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      {/* Toasts */}
      <div className="pointer-events-none fixed left-1/2 top-4 z-[2000] -translate-x-1/2 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              'pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-lg motion-safe:animate-[fadeIn_.24s_ease-out]',
              t.type === 'success'
                ? 'bg-emerald-600 text-white'
                : t.type === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-800 text-white',
            ].join(' ')}
          >
            {t.type === 'success' && <CheckCircle2 size={18} />}
            {t.type === 'error' && <AlertTriangle size={18} />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Kopf + PageSize */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          onClick={() => {
            if (tab === 'boats') {
              setBoatPage(1)
              loadBoats({ page: 1 })
            } else {
              setProfilePage(1)
              loadProfiles({ page: 1 })
            }
          }}
        >
          <RefreshCcw size={16} /> Aktualisieren
        </button>

        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-500 dark:text-slate-400">
            pro Seite
          </label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {(['boats', 'profiles'] as const).map((t) => (
          <button
            key={t}
            type="button"
            className={[
              'rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand/40',
              tab === t
                ? 'bg-brand text-white'
                : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800',
            ].join(' ')}
            onClick={() => {
              setTab(t)
              if (t === 'boats') {
                setBoatPage(1)
                loadBoats({ page: 1 })
              } else {
                setProfilePage(1)
                loadProfiles({ page: 1 })
              }
            }}
          >
            {t === 'boats' ? 'Boote' : 'Profile'}
          </button>
        ))}
      </div>

      {/* Suche/Filter */}
      {tab === 'boats' ? (
        <SearchPanel
          placeholder="Suche Boote (Name, Typ, Ort, Land)…"
          value={boatQueryInput}
          onChange={setBoatQueryInput}
          onSearch={handleBoatSearch}
          onReset={handleBoatReset}
          sortValue={boatSort}
          onSortChange={(v) => setBoatSort(v as any)}
          sortOptions={[
            { value: 'inserted_at.desc', label: 'Neueste zuerst' },
            { value: 'price.asc', label: 'Preis aufsteigend' },
            { value: 'price.desc', label: 'Preis absteigend' },
          ]}
        />
      ) : (
        <SearchPanel
          placeholder="Suche Profile (E‑Mail, Vorname, Nachname)…"
          value={profileQueryInput}
          onChange={setProfileQueryInput}
          onSearch={handleProfileSearch}
          onReset={handleProfileReset}
          sortValue={profileSort}
          onSortChange={(v) => setProfileSort(v as any)}
          sortOptions={[
            { value: 'created_at.desc', label: 'Neueste zuerst' },
            { value: 'firstname.asc', label: 'Vorname A–Z' },
            { value: 'lastname.asc', label: 'Nachname A–Z' },
          ]}
        />
      )}

      {/* Listen */}
      {tab === 'boats' ? (
        <>
          {/* Desktop: Tabelle */}
          <div className="hidden overflow-x-auto md:block">
            <div className="min-w-[680px] rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="sticky top-0 grid grid-cols-12 border-b bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
                <div className="col-span-4">Boot</div>
                <div className="col-span-2">Typ</div>
                <div className="col-span-2">Preis</div>
                <div className="col-span-2">Ort</div>
                <div className="col-span-2 text-right">Aktionen</div>
              </div>
              {boats.map((b) => (
                <div
                  key={b.id}
                  className="grid grid-cols-12 items-center border-b px-4 py-3 text-sm last:border-0 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/50"
                >
                  <div className="col-span-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-100">
                      {b.name ?? '–'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {b.country ?? '—'}
                    </div>
                  </div>
                  <div className="col-span-2 text-slate-700 dark:text-slate-200">
                    {b.type ?? '–'}
                  </div>
                  <div className="col-span-2 text-slate-700 dark:text-slate-200">
                    {typeof b.price === 'number'
                      ? `€ ${b.price.toFixed(0)}`
                      : '–'}
                  </div>
                  <div className="col-span-2 text-slate-700 dark:text-slate-200">
                    {b.location ?? '–'}
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <EditBtn
                      onClick={() => setEdit({ table: 'boats', row: { ...b } })}
                    />
                    <DeleteBtn
                      onClick={() =>
                        openConfirm('boats', b.id, b.name || 'Boot')
                      }
                    />
                  </div>
                </div>
              ))}
              <FooterPager
                page={boatPage}
                total={boatTotal}
                totalPages={boatTotalPages}
                onPage={(p) => {
                  setBoatPage(p)
                  loadBoats({ page: p })
                }}
              />
            </div>
          </div>

          {/* Mobile: Cards */}
          <div className="space-y-3 md:hidden">
            {boats.map((b) => (
              <div
                key={b.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">
                    {b.name ?? '–'}
                  </h3>
                  <div className="flex gap-2">
                    <EditBtn
                      onClick={() => setEdit({ table: 'boats', row: { ...b } })}
                    />
                    <DeleteBtn
                      onClick={() =>
                        openConfirm('boats', b.id, b.name || 'Boot')
                      }
                    />
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <Info term="Typ" value={b.type ?? '–'} />
                  <Info
                    term="Preis"
                    value={
                      typeof b.price === 'number'
                        ? `€ ${b.price.toFixed(0)}`
                        : '–'
                    }
                  />
                  <Info term="Ort" value={b.location ?? '–'} />
                  <Info term="Land" value={b.country ?? '–'} />
                </dl>
              </div>
            ))}
            <FooterPager
              page={boatPage}
              total={boatTotal}
              totalPages={boatTotalPages}
              onPage={(p) => {
                setBoatPage(p)
                loadBoats({ page: p })
              }}
            />
          </div>
        </>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <div className="min-w-[680px] rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="sticky top-0 grid grid-cols-12 border-b bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
                <div className="col-span-4">Name</div>
                <div className="col-span-4">E‑Mail</div>
                <div className="col-span-2">Rolle</div>
                <div className="col-span-2 text-right">Aktionen</div>
              </div>
              {profiles.map((p) => (
                <div
                  key={p.id}
                  className="grid grid-cols-12 items-center border-b px-4 py-3 text-sm last:border-0 hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/50"
                >
                  <div className="col-span-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-100">
                      {(p.firstname || '–') + ' ' + (p.lastname || '')}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      ID: {p.id.slice(0, 8)}…
                    </div>
                  </div>
                  <div className="col-span-4 text-slate-700 dark:text-slate-200">
                    {p.email ?? '–'}
                  </div>
                  <div className="col-span-2">
                    <span
                      className={[
                        'rounded-full px-2 py-1 text-xs font-bold',
                        p.role === 'admin'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
                      ].join(' ')}
                    >
                      {p.role}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <EditBtn
                      onClick={() =>
                        setEdit({ table: 'profiles', row: { ...p } })
                      }
                    />
                    <DeleteBtn
                      onClick={() =>
                        openConfirm(
                          'profiles',
                          p.id,
                          p.email || `${p.firstname} ${p.lastname}`,
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              <FooterPager
                page={profilePage}
                total={profileTotal}
                totalPages={profileTotalPages}
                onPage={(p) => {
                  setProfilePage(p)
                  loadProfiles({ page: p })
                }}
              />
            </div>
          </div>

          {/* Mobile: Cards */}
          <div className="space-y-3 md:hidden">
            {profiles.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">
                    {(p.firstname || '–') + ' ' + (p.lastname || '')}
                  </h3>
                  <div className="flex gap-2">
                    <EditBtn
                      onClick={() =>
                        setEdit({ table: 'profiles', row: { ...p } })
                      }
                    />
                    <DeleteBtn
                      onClick={() =>
                        openConfirm(
                          'profiles',
                          p.id,
                          p.email || `${p.firstname} ${p.lastname}`,
                        )
                      }
                    />
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <Info term="E‑Mail" value={p.email ?? '–'} />
                  <Info
                    term="Rolle"
                    value={p.role}
                    badge={p.role === 'admin' ? 'admin' : 'user'}
                  />
                  <Info term="ID" value={p.id.slice(0, 8) + '…'} />
                </dl>
              </div>
            ))}
            <FooterPager
              page={profilePage}
              total={profileTotal}
              totalPages={profileTotalPages}
              onPage={(p) => {
                setProfilePage(p)
                loadProfiles({ page: p })
              }}
            />
          </div>
        </>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[800] flex items-center justify-center bg-black/10">
          <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow dark:bg-slate-900/90 dark:text-slate-100">
            <Loader2 className="animate-spin" size={16} /> Lädt…
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {edit && (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                {edit.table === 'boats'
                  ? 'Boot bearbeiten'
                  : 'Profil bearbeiten'}
              </h3>
              <button
                type="button"
                onClick={() => setEdit(null)}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label="Schließen"
              >
                <X size={16} />
              </button>
            </div>

            {edit.table === 'boats' ? (
              <div className="space-y-3">
                <LabeledInput
                  label="Name"
                  value={edit.row.name ?? ''}
                  onChange={(v) =>
                    setEdit({ table: 'boats', row: { ...edit.row, name: v } })
                  }
                />
                <LabeledInput
                  label="Typ"
                  value={edit.row.type ?? ''}
                  onChange={(v) =>
                    setEdit({ table: 'boats', row: { ...edit.row, type: v } })
                  }
                />
                <LabeledInput
                  label="Preis (€)"
                  type="number"
                  value={edit.row.price ?? ''}
                  onChange={(v) =>
                    setEdit({
                      table: 'boats',
                      row: { ...edit.row, price: v === '' ? null : Number(v) },
                    })
                  }
                />
                <LabeledInput
                  label="Ort"
                  value={edit.row.location ?? ''}
                  onChange={(v) =>
                    setEdit({
                      table: 'boats',
                      row: { ...edit.row, location: v },
                    })
                  }
                />
                <LabeledInput
                  label="Land"
                  value={edit.row.country ?? ''}
                  onChange={(v) =>
                    setEdit({
                      table: 'boats',
                      row: { ...edit.row, country: v },
                    })
                  }
                />
              </div>
            ) : (
              <div className="space-y-3">
                <LabeledInput
                  label="Vorname"
                  value={edit.row.firstname ?? ''}
                  onChange={(v) =>
                    setEdit({
                      table: 'profiles',
                      row: { ...edit.row, firstname: v },
                    })
                  }
                />
                <LabeledInput
                  label="Nachname"
                  value={edit.row.lastname ?? ''}
                  onChange={(v) =>
                    setEdit({
                      table: 'profiles',
                      row: { ...edit.row, lastname: v },
                    })
                  }
                />
                <LabeledInput
                  label="E‑Mail"
                  value={edit.row.email ?? ''}
                  onChange={(v) =>
                    setEdit({
                      table: 'profiles',
                      row: { ...edit.row, email: v },
                    })
                  }
                />
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Rolle
                  </label>
                  <select
                    value={edit.row.role ?? 'user'}
                    onChange={(e) =>
                      setEdit({
                        table: 'profiles',
                        row: {
                          ...edit.row,
                          role: e.target.value as 'user' | 'admin',
                        },
                      })
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEdit(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={saveEdit}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand/90 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirm.open && (
        <div className="fixed inset-0 z-[1600] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                Löschen bestätigen
              </h3>
              <button
                type="button"
                onClick={() => setConfirm({ open: false })}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label="Schließen"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              Soll <span className="font-semibold">{confirm.label}</span>{' '}
              wirklich gelöscht werden? Diese Aktion kann nicht rückgängig
              gemacht werden.
            </p>

            {countdown > 0 && (
              <div className="mt-3 rounded-xl bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                Bitte warte {countdown} Sekunde{countdown === 1 ? '' : 'n'},
                bevor du endgültig löschen kannst.
              </div>
            )}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirm({ open: false })}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Abbrechen
              </button>
              <button
                type="button"
                disabled={countdown > 0 || deleting}
                onClick={performDelete}
                className={[
                  'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm',
                  countdown > 0 || deleting
                    ? 'bg-red-400'
                    : 'bg-red-600 hover:bg-red-700',
                ].join(' ')}
              >
                {deleting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Trash2 size={16} />
                )}
                Endgültig löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- kleine UI‑Bausteine ---------- */

function SearchPanel(props: {
  placeholder: string
  value: string
  onChange: (v: string) => void
  onSearch: () => void
  onReset: () => void
  sortValue: string
  onSortChange: (v: string) => void
  sortOptions: { value: string; label: string }[]
}) {
  const {
    placeholder,
    value,
    onChange,
    onSearch,
    onReset,
    sortValue,
    onSortChange,
    sortOptions,
  } = props
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-2 grid grid-cols-12 gap-2">
        <div className="col-span-12 md:col-span-9">
          <label className="sr-only">Suche</label>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950/40">
            <Search size={16} className="text-slate-400" />
            <input
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-400"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSearch()
              }}
            />
          </div>
        </div>
        <div className="col-span-12 md:col-span-3">
          <button
            type="button"
            onClick={onSearch}
            className="w-full rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            Suchen
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12 md:col-span-6">
          <button
            type="button"
            onClick={onReset}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Zurücksetzen
          </button>
        </div>
        <div className="col-span-12 md:col-span-6">
          <div className="relative">
            <label className="sr-only">Sortierung</label>
            <select
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              value={sortValue}
              onChange={(e) => onSortChange(e.target.value)}
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function FooterPager({
  page,
  total,
  totalPages,
  onPage,
}: {
  page: number
  total: number
  totalPages: number
  onPage: (p: number) => void
}) {
  return (
    <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs text-slate-500 dark:text-slate-400">
        Seite {page} von {totalPages} · {total} Einträge
      </span>
      <Pagination page={page} totalPages={totalPages} onPage={onPage} />
    </div>
  )
}

function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number
  totalPages: number
  onPage: (p: number) => void
}) {
  // Fenster mit Ellipsen (1,2, p-1,p,p+1, last-1,last)
  const list: number[] = []
  const add = (n: number) => {
    if (n >= 1 && n <= totalPages) list.push(n)
  }
  add(1)
  add(2)
  for (let n = page - 1; n <= page + 1; n++) add(n)
  add(totalPages - 1)
  add(totalPages)
  const dedup = Array.from(new Set(list)).sort((a, b) => a - b)

  const parts: (number | '…')[] = []
  for (let i = 0; i < dedup.length; i++) {
    const n = dedup[i]
    const prev = dedup[i - 1]
    if (i > 0 && n - (prev ?? 0) > 1) parts.push('…')
    parts.push(n)
  }

  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <nav className="flex items-center gap-1">
      <button
        onClick={() => canPrev && onPage(page - 1)}
        disabled={!canPrev}
        className="min-w-8 h-8 rounded-md border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Zurück
      </button>

      {parts.map((p, idx) =>
        p === '…' ? (
          <span
            key={`gap-${idx}`}
            className="px-2 text-sm text-slate-500 dark:text-slate-400"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={[
              'min-w-8 h-8 rounded-md px-2 text-sm font-semibold',
              p === page
                ? 'bg-brand text-white'
                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
            ].join(' ')}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => canNext && onPage(page + 1)}
        disabled={!canNext}
        className="min-w-8 h-8 rounded-md border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Weiter
      </button>
    </nav>
  )
}

function EditBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <Pencil size={14} /> Bearbeiten
    </button>
  )
}
function DeleteBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
    >
      <Trash2 size={14} /> Löschen
    </button>
  )
}
function Info({
  term,
  value,
  badge,
}: {
  term: string
  value: string
  badge?: 'admin' | 'user'
}) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs text-slate-500 dark:text-slate-400">{term}</dt>
      <dd className="text-slate-800 dark:text-slate-200">
        {badge ? (
          <span
            className={[
              'rounded-full px-2 py-0.5 text-xs font-bold',
              badge === 'admin'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
            ].join(' ')}
          >
            {value}
          </span>
        ) : (
          value
        )}
      </dd>
    </div>
  )
}

function LabeledInput({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string | number | null
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-56 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"
      />
    </div>
  )
}

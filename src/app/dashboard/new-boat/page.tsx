// src/app/dashboard/new-boat/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { User } from '@supabase/supabase-js'
import { ArrowLeft, Check, Loader2, X, UploadCloud } from 'lucide-react'

type FormState = {
  name: string
  type: string
  price: string
  location: string
  country: string
  persons: string
  ps: string
  length: string
  available: boolean
}

const TAG_OPTIONS = [
  'Mit Kapitän',
  'Sofort buchbar',
  'Familienfreundlich',
  'Haustiere erlaubt',
  'Führerscheinfrei',
  'Top-Zustand',
  'Sport & Wake',
  'Angeln geeignet',
  'Luxus',
  'Öko/Elektro',
] as const

export default function NewBoatPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<User | null>(null)

  const [form, setForm] = useState<FormState>({
    name: '',
    type: '',
    price: '',
    location: '',
    country: '',
    persons: '',
    ps: '',
    length: '',
    available: true,
  })
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([]) // max 10
  const [previews, setPreviews] = useState<string[]>([]) // blob URLs for preview
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [okMsg, setOkMsg] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
  }, [supabase])

  // Previews aktualisieren
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [files])

  function toggleTag(tag: string) {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag)
      if (prev.length >= 2) return prev // max 2
      return [...prev, tag]
    })
  }

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files || [])
    if (!picked.length) return
    // Filter: nur Bilder, max 10 total, maximal ~10 MB je Datei
    const valid = picked.filter(
      (f) => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024,
    )
    const next = [...files, ...valid].slice(0, 10)
    setFiles(next)
    e.target.value = '' // reset input für erneutes Auswählen
  }
  function removeFile(idx: number) {
    setFiles((arr) => arr.filter((_, i) => i !== idx))
  }

  function setField<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function uploadAllImages(userId: string) {
    if (files.length === 0)
      return { urls: [] as string[], cover: null as string | null }

    const bucket = supabase.storage.from('boat-images')
    const uploads = await Promise.all(
      files.map(async (file, idx) => {
        const ext = file.name.split('.').pop() || 'jpg'
        const path = `${userId}/${Date.now()}_${idx}.${ext}`
        const { error: upErr } = await bucket.upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        })
        if (upErr) throw upErr
        const { data } = bucket.getPublicUrl(path)
        return data.publicUrl
      }),
    )

    return { urls: uploads, cover: uploads[0] ?? null }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setOkMsg(null)

    if (!user) {
      setError('Bitte melde dich an.')
      return
    }
    if (!form.name.trim()) return setError('Bitte einen Namen angeben.')
    if (!form.price || isNaN(Number(form.price)))
      return setError('Preis muss eine Zahl sein.')
    if (form.persons && isNaN(Number(form.persons)))
      return setError('Personen muss eine Zahl sein.')
    if (form.ps && isNaN(Number(form.ps)))
      return setError('PS muss eine Zahl sein.')
    if (selectedTags.length > 2) return setError('Maximal zwei Tags erlaubt.')
    if (files.length > 10) return setError('Maximal 10 Bilder erlaubt.')

    setLoading(true)
    try {
      const { urls, cover } = await uploadAllImages(user.id)

      const { error: insertErr } = await supabase.from('boats').insert({
        name: form.name.trim(),
        type: form.type || null,
        price: Number(form.price),
        location: form.location || null,
        country: form.country || null,
        image_url: cover, // Cover (erstes Bild)
        images: urls.length ? urls : null, // alle Bilder
        rating: null,
        reviews: null,
        available: form.available,
        persons: form.persons ? Number(form.persons) : null,
        ps: form.ps ? Number(form.ps) : null,
        length: form.length || null,
        tags: selectedTags.length ? selectedTags : null,
        owner: user.id,
      })

      if (insertErr) throw insertErr

      setOkMsg('Inserat erfolgreich erstellt.')
      setTimeout(() => router.push('/dashboard'), 900)
    } catch (err: any) {
      setError(err.message ?? 'Upload/Insert fehlgeschlagen.')
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = useMemo(
    () => !!form.name && !!form.price && !loading,
    [form.name, form.price, loading],
  )

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm
                       font-semibold text-slate-700 transition hover:bg-slate-50
                       dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={16} /> Zurück
          </button>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-2xl">
            Neues Inserat erstellen
          </h1>
          <div />
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-slate-200 bg-white
                     p-5 shadow transition
                     dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Name des Boots *
              </label>
              <input
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800
                           focus:outline-none focus:ring-2 focus:ring-brand
                           dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="z.B. Bavaria Cruiser 46"
                required
              />
            </div>

            {/* Typ */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Typ
              </label>
              <select
                value={form.type}
                onChange={(e) => setField('type', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800
                           focus:outline-none focus:ring-2 focus:ring-brand
                           dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="">Bitte wählen…</option>
                <option>Segelboot</option>
                <option>Motorboot</option>
                <option>Yacht</option>
                <option>RIB</option>
                <option>Katamaran</option>
              </select>
            </div>

            {/* Preis */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Preis / Tag (EUR) *
              </label>
              <input
                inputMode="decimal"
                value={form.price}
                onChange={(e) => setField('price', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800
                           focus:outline-none focus:ring-2 focus:ring-brand
                           dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="z.B. 350"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Ort / Hafen
              </label>
              <input
                value={form.location}
                onChange={(e) => setField('location', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800
                           focus:outline-none focus:ring-2 focus:ring-brand
                           dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="z.B. Palma de Mallorca"
              />
            </div>

            {/* Land */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Land
              </label>
              <input
                value={form.country}
                onChange={(e) => setField('country', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800
                           focus:outline-none focus:ring-2 focus:ring-brand
                           dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="z.B. Spanien"
              />
            </div>

            {/* Personen */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Personen (max.)
              </label>
              <input
                inputMode="numeric"
                value={form.persons}
                onChange={(e) => setField('persons', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800
                           focus:outline-none focus:ring-2 focus:ring-brand
                           dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="z.B. 8"
              />
            </div>

            {/* PS */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Leistung (PS)
              </label>
              <input
                inputMode="numeric"
                value={form.ps}
                onChange={(e) => setField('ps', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800
                           focus:outline-none focus:ring-2 focus:ring-brand
                           dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="z.B. 250"
              />
            </div>

            {/* Länge */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Länge
              </label>
              <input
                value={form.length}
                onChange={(e) => setField('length', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-800
                           focus:outline-none focus:ring-2 focus:ring-brand
                           dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="z.B. 12m"
              />
            </div>

            {/* Tags (max 2) */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Tags (max. 2)
              </label>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map((tag) => {
                  const active = selectedTags.includes(tag)
                  const disabled = !active && selectedTags.length >= 2
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      disabled={disabled}
                      className={[
                        'rounded-full border px-3 py-1.5 text-sm font-semibold transition',
                        active
                          ? 'border-brand bg-brand text-white hover:bg-brand-light'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
                        disabled ? 'cursor-not-allowed opacity-50' : '',
                      ].join(' ')}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Bilder hochladen (max 10) */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Bilder (max. 10)
              </label>
              <div className="flex items-center gap-3">
                <label
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-2 text-sm
                                   font-semibold text-slate-700 transition hover:bg-slate-100
                                   dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <UploadCloud size={18} />
                  Dateien wählen
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={onPickFiles}
                  />
                </label>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  PNG/JPG, max. 10MB pro Datei
                </span>
              </div>

              {previews.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {previews.map((src, i) => (
                    <div
                      key={i}
                      className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700"
                    >
                      <img
                        src={src}
                        alt={`Bild ${i + 1}`}
                        className="h-36 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white"
                        aria-label="Bild entfernen"
                      >
                        <X size={16} />
                      </button>
                      {i === 0 && (
                        <span className="absolute left-1 top-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-slate-800 dark:bg-slate-900/80 dark:text-slate-100">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verfügbar */}
            <div className="sm:col-span-2">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) => setField('available', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand dark:border-slate-600"
                />
                Inserat ist verfügbar
              </label>
            </div>
          </div>

          {/* Status */}
          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}
          {okMsg && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
              <Check size={16} /> {okMsg}
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm
                         font-semibold text-slate-700 transition hover:bg-slate-50
                         dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-2 text-sm font-semibold
                         text-white transition hover:bg-brand-light disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="mr-2 animate-spin" size={16} />
              ) : null}
              Inserat erstellen
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Users, Search, CalendarDays, Minus, Plus } from 'lucide-react'
import { DayPicker, DateRange } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

export default function ModernSearchBar() {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [range, setRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  })
  const [showCal, setShowCal] = useState(false)
  const [persons, setPersons] = useState(1)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (range.from) params.set('from', range.from.toISOString().slice(0, 10))
    if (range.to) params.set('to', range.to.toISOString().slice(0, 10))
    if (persons) params.set('persons', String(persons))
    router.push(`/search?${params.toString()}`)
  }

  // Responsives Grid für Mobile/Desktop
  return (
    <form
      onSubmit={onSubmit}
      className="
        relative mx-auto flex w-full max-w-xl
        flex-col
        gap-3 rounded-2xl
        border border-gray-200 bg-white/95 p-3
        shadow-xl sm:max-w-2xl
        sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:p-2 md:max-w-3xl
        lg:max-w-5xl
      "
      style={{ minHeight: 64, marginTop: '2.5rem' }}
    >
      {/* Standort */}
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 sm:rounded-full sm:border-0">
        <MapPin className="h-5 w-5 text-brand/70" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ort oder Region"
          className="flex-1 border-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
          autoComplete="off"
        />
      </div>

      {/* Zeitraum */}
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 sm:mx-2 sm:rounded-full sm:border-0 sm:border-l">
        <CalendarDays className="h-5 w-5 text-brand/70" />
        <button
          type="button"
          onClick={() => setShowCal(true)}
          className="flex-1 bg-transparent text-left text-base text-gray-700 outline-none placeholder:text-gray-400"
          tabIndex={0}
        >
          {range.from && range.to
            ? `${range.from.toLocaleDateString()} – ${range.to.toLocaleDateString()}`
            : 'Datum auswählen'}
        </button>
        {showCal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
            onClick={() => setShowCal(false)}
          >
            <div
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <DayPicker
                mode="range"
                selected={range}
                onSelect={(range) =>
                  setRange(range ?? { from: undefined, to: undefined })
                }
                numberOfMonths={window.innerWidth < 640 ? 1 : 2}
                pagedNavigation
                fixedWeeks
                required={false}
              />
              <button
                type="button"
                className="mt-4 w-full rounded-lg bg-brand px-6 py-3 text-white transition hover:bg-brand-light"
                onClick={() => setShowCal(false)}
              >
                Fertig
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Personen */}
      <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white p-3 sm:rounded-full sm:border-0">
        <Users className="h-5 w-5 text-brand/70" />
        <button
          type="button"
          onClick={() => setPersons((p) => Math.max(1, p - 1))}
          className="rounded-full bg-sky/60 px-2 py-1 text-base font-bold text-brand outline-none transition hover:bg-brand-light focus:ring-0"
          tabIndex={-1}
          aria-label="Personen verringern"
        >
          <Minus size={18} />
        </button>
        <span className="w-6 select-none text-center text-base font-semibold">
          {persons}
        </span>
        <button
          type="button"
          onClick={() => setPersons((p) => Math.min(20, p + 1))}
          className="rounded-full bg-sky/60 px-2 py-1 text-base font-bold text-brand outline-none transition hover:bg-brand-light focus:ring-0"
          tabIndex={-1}
          aria-label="Personen erhöhen"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Suchen-Button */}
      <button
        type="submit"
        className="
          mt-2 flex
          w-full items-center justify-center
          gap-2 rounded-full bg-brand px-7
          py-3 text-lg font-bold text-white shadow transition hover:bg-brand-light
          focus:outline-none sm:ml-3 sm:mt-0
          sm:w-auto
        "
        aria-label="Suchen"
        style={{
          boxShadow: '0 6px 32px 0 rgba(22, 136, 197, 0.10)',
        }}
      >
        <Search className="h-5 w-5" />
        <span className="hidden sm:block">Suchen</span>
      </button>
    </form>
  )
}

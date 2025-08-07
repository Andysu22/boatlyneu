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

  return (
    <form
      onSubmit={onSubmit}
      className="
        relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-2 
        rounded-2xl border border-brand/10 bg-white/95 px-2 
        py-3 shadow-md sm:flex-row sm:gap-0 sm:rounded-full sm:shadow-lg
      "
      style={{ minHeight: 56 }}
    >
      {/* Standort */}
      <div className="flex flex-1 items-center gap-2 px-3">
        <MapPin className="h-5 w-5 text-brand/70" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Wohin möchtest du?"
          className="flex-1 border-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
          autoComplete="off"
        />
      </div>

      {/* Trenner */}
      <div className="my-auto hidden h-8 w-px bg-gray-200/80 sm:flex" />

      {/* Zeitraum */}
      <div className="relative flex flex-1 items-center gap-2 px-3">
        <CalendarDays className="h-5 w-5 text-brand/70" />
        <button
          type="button"
          onClick={() => setShowCal(true)}
          className="flex-1 border-none bg-transparent text-left text-base text-gray-700 outline-none placeholder:text-gray-400"
          tabIndex={0}
        >
          {range.from && range.to
            ? `${range.from.toLocaleDateString()} – ${range.to.toLocaleDateString()}`
            : 'Zeitraum wählen'}
        </button>
        {/* Calendar Modal */}
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
                numberOfMonths={1}
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

      {/* Trenner */}
      <div className="my-auto hidden h-8 w-px bg-gray-200/80 sm:flex" />

      {/* Personen */}
      <div className="flex items-center gap-2 px-3">
        <Users className="h-5 w-5 text-brand/70" />
        <button
          type="button"
          onClick={() => setPersons((p) => Math.max(1, p - 1))}
          className="rounded-full bg-sky/60 px-2 py-1 text-base font-bold text-brand transition hover:bg-brand-light"
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
          className="rounded-full bg-sky/60 px-2 py-1 text-base font-bold text-brand transition hover:bg-brand-light"
          tabIndex={-1}
          aria-label="Personen erhöhen"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Trenner */}
      <div className="my-auto hidden h-8 w-px bg-gray-200/80 sm:flex" />

      {/* Suchen */}
      <button
        type="submit"
        className="
          mt-2 flex min-h-[48px] w-full items-center gap-2 rounded-full bg-brand px-6 text-lg font-bold text-white
          shadow transition hover:bg-brand-light sm:mt-0 sm:w-auto
        "
        aria-label="Suchen"
      >
        <Search className="h-5 w-5" />
        Suchen
      </button>
    </form>
  )
}

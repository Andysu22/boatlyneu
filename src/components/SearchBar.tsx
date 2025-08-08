'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  MapPin,
  Users,
  Search,
  CalendarDays,
  Minus,
  Plus,
  Info,
} from 'lucide-react'
import { DayPicker, DateRange } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

function formatDateInput(d?: Date) {
  if (!d) return ''
  return d.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
function parseDateInput(str: string) {
  const [tt, mm, jjjj] = str.split('.')
  if (tt?.length === 2 && mm?.length === 2 && jjjj?.length === 4) {
    const d = new Date(+jjjj, +mm - 1, +tt)
    if (
      d.getFullYear() === +jjjj &&
      d.getMonth() === +mm - 1 &&
      d.getDate() === +tt
    )
      return d
  }
  return undefined
}
function addMonths(date: Date, n: number) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + n)
  return d
}
function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}
function addDays(d: Date, n: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

export default function ModernSearchBar() {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [range, setRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  })
  const [showCal, setShowCal] = useState(false)
  const [persons, setPersons] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [fromInput, setFromInput] = useState('')
  const [toInput, setToInput] = useState('')
  const [focused, setFocused] = useState<'from' | 'to' | null>(null)
  const fromRef = useRef<HTMLInputElement>(null)
  const toRef = useRef<HTMLInputElement>(null)

  // heute als Grenze für disabled
  const today = startOfDay(new Date())

  // kontrollierter Monat (eigene Nav)
  const [month, setMonth] = useState<Date>(today)

  // remount key, um Hover/Preview-State sicher zu resetten
  const [pickerKey, setPickerKey] = useState(0)

  // kleine Notification im Kalender
  const [note, setNote] = useState<string | null>(null)
  function notify(msg: string) {
    setNote(msg)
    setTimeout(() => setNote(null), 1800)
  }

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640)
    handler()
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    setFromInput(range.from ? formatDateInput(range.from) : '')
    setToInput(range.to ? formatDateInput(range.to) : '')
  }, [range.from, range.to])

  useEffect(() => {
    if (showCal) setMonth(range.from ?? today)
  }, [showCal]) // eslint-disable-line

  // disabled-Check (hier: alles vor heute)
  function isDisabled(d?: Date) {
    if (!d) return true
    return startOfDay(d) < today
  }
  function nextValidDate(d: Date) {
    return isDisabled(d) ? today : d
  }

  function handleInput(
    e: React.ChangeEvent<HTMLInputElement>,
    which: 'from' | 'to',
  ) {
    let val = e.target.value.replace(/[^\d.]/g, '')
    if (val.length === 2 && !val.includes('.')) val += '.'
    if (val.length === 5 && val[2] === '.' && !val.slice(3).includes('.'))
      val += '.'
    if (val.length > 10) val = val.slice(0, 10)
    if (which === 'from') setFromInput(val)
    if (which === 'to') setToInput(val)

    if (which === 'from' && val.length === 10) {
      toRef.current?.focus()
      setFocused('to')
    }

    const parsed = parseDateInput(val)

    if (which === 'from') {
      let newFrom = parsed
      if (parsed && isDisabled(parsed)) {
        newFrom = nextValidDate(parsed)
        notify(
          'Datum liegt in der Vergangenheit – auf den nächsten verfügbaren Tag gesetzt.',
        )
      }
      setRange((r) => {
        const updated: DateRange = { ...r, from: newFrom ?? undefined }
        // Falls to vorhanden, aber vor from -> to anpassen (mind. +1 Tag, aber nicht in Vergangenheit)
        if (
          updated.from &&
          r.to &&
          startOfDay(r.to) <= startOfDay(updated.from)
        ) {
          const candidate = addDays(updated.from, 1)
          updated.to = isDisabled(candidate) ? addDays(today, 1) : candidate
        }
        return updated
      })
      setPickerKey((k) => k + 1)
      if (newFrom) setMonth(newFrom)
    }

    if (which === 'to') {
      let newTo = parsed
      if (parsed && isDisabled(parsed)) {
        newTo = nextValidDate(parsed)
        notify(
          'Datum liegt in der Vergangenheit – auf den nächsten verfügbaren Tag gesetzt.',
        )
      }
      setRange((r) => {
        let updated: DateRange = { ...r, to: newTo ?? undefined }
        // Wenn from gesetzt und to <= from → to mindestens +1 Tag nach from
        if (
          updated.from &&
          updated.to &&
          startOfDay(updated.to) <= startOfDay(updated.from)
        ) {
          const candidate = addDays(updated.from, 1)
          updated.to = isDisabled(candidate) ? addDays(today, 1) : candidate
          notify('Check-out muss nach Check-in liegen – automatisch angepasst.')
        }
        return updated
      })
      setPickerKey((k) => k + 1)
      if (newTo) {
        if (range.from) {
          // Prüfen, ob Start- und Endmonat unterschiedlich sind
          const fromMonth = range.from.getMonth()
          const toMonth = newTo.getMonth()
          const fromYear = range.from.getFullYear()
          const toYear = newTo.getFullYear()

          if (fromMonth !== toMonth || fromYear !== toYear) {
            setMonth(range.from) // ersten Monat auf Startdatum setzen
          } else {
            setMonth(newTo) // gleiches Monat/Jahr → Enddatum anzeigen
          }
        } else {
          setMonth(newTo) // falls noch kein Startdatum vorhanden
        }
      }
    }
  }

  // Klick-Logik + Remount beim Range-Neustart (verhindert „klebende“ Markierungen)
  function handleDayClick(day: Date) {
    if (isDisabled(day)) {
      notify('Dieser Tag ist nicht verfügbar.')
      return
    }
    if (!range.from || (range.from && range.to)) {
      setRange({ from: day, to: undefined })
      setPickerKey((k) => k + 1)
      setFocused('to')
      setTimeout(() => toRef.current?.focus(), 60)
      return
    }
    if (day <= range.from) {
      setRange({ from: day, to: undefined })
      setPickerKey((k) => k + 1)
      setFocused('to')
      setTimeout(() => toRef.current?.focus(), 60)
    } else {
      setRange({ from: range.from, to: day })
      setFocused('from')
      setTimeout(() => fromRef.current?.focus(), 60)
    }
  }

  function resetRange() {
    setRange({ from: undefined, to: undefined })
    setPickerKey((k) => k + 1)
    setFromInput('')
    setToInput('')
    setFocused('from')
    setTimeout(() => fromRef.current?.focus(), 60)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (range.from) params.set('from', range.from.toISOString().slice(0, 10))
    if (range.to) params.set('to', range.to.toISOString().slice(0, 10))
    if (persons) params.set('persons', String(persons))
    router.push(`/search?${params.toString()}`)
  }

  const prevMonth = addMonths(month, -1)
  const nextMonth = addMonths(month, 1)
  const prevLabel = prevMonth.toLocaleString('de-DE', { month: 'long' })
  const nextLabel = nextMonth.toLocaleString('de-DE', { month: 'long' })

  const calendarWidth = isMobile ? '98vw' : '760px'

  return (
    <form
      onSubmit={onSubmit}
      className="
        relative mx-auto flex w-full max-w-xl
        flex-col gap-3 rounded-2xl
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
            ? `${formatDateInput(range.from)} — ${formatDateInput(range.to)}`
            : 'Reisedaten auswählen'}
        </button>

        {/* Kalender-Modal */}
        {showCal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
            onClick={() => setShowCal(false)}
          >
            <div
              className="relative w-full max-w-3xl overflow-visible rounded-2xl bg-white p-0 shadow-2xl"
              style={{ minWidth: calendarWidth, maxWidth: calendarWidth }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Notification */}
              {note && (
                <div className="pointer-events-none absolute left-1/2 top-3 z-50 -translate-x-1/2 select-none rounded-full bg-gray-900/90 px-4 py-2 text-sm font-medium text-white shadow">
                  <span className="inline-flex items-center gap-2">
                    <Info size={16} />
                    {note}
                  </span>
                </div>
              )}

              {/* Topbar */}
              <div className="flex items-center justify-between px-6 pb-2 pt-6">
                <button
                  className="flex items-center rounded-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  type="button"
                  onClick={() => setMonth((prev) => addMonths(prev, -1))}
                >
                  <span className="mr-2 text-2xl">←</span>
                  {prevLabel}
                </button>

                <div className="text-center">
                  <div className="text-lg font-bold">
                    Wann möchtest du in See stechen?
                  </div>
                </div>

                <button
                  className="flex items-center rounded-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  type="button"
                  onClick={() => setMonth((prev) => addMonths(prev, 1))}
                >
                  {nextLabel}
                  <span className="ml-2 text-2xl">→</span>
                </button>
              </div>

              {/* Check-in/out Inputs */}
              <div className="flex items-center justify-between gap-4 px-6 pb-4">
                <div className="flex flex-col" style={{ width: 180 }}>
                  <label className="mb-1 text-sm font-semibold">Check-in</label>
                  <input
                    ref={fromRef}
                    className={`w-full rounded-lg border-2 px-3 py-2 text-base outline-none transition ${
                      focused === 'from' ? 'border-brand' : 'border-gray-200'
                    } text-left`}
                    placeholder="TT.MM.JJJJ"
                    value={fromInput}
                    onFocus={() => setFocused('from')}
                    onBlur={() => setFocused(null)}
                    onChange={(e) => handleInput(e, 'from')}
                    maxLength={10}
                    autoComplete="off"
                  />
                </div>
                <div className="flex flex-col" style={{ width: 180 }}>
                  <label className="mb-1 text-sm font-semibold">
                    Check-out
                  </label>
                  <input
                    ref={toRef}
                    className={`w-full rounded-lg border-2 px-3 py-2 text-base outline-none transition ${
                      focused === 'to' ? 'border-brand' : 'border-gray-200'
                    } text-right`}
                    placeholder="TT.MM.JJJJ"
                    value={toInput}
                    onFocus={() => setFocused('to')}
                    onBlur={() => setFocused(null)}
                    onChange={(e) => handleInput(e, 'to')}
                    maxLength={10}
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Kalender */}
              <div className="flex items-start justify-between gap-12 px-10 pb-4 pt-1">
                <DayPicker
                  key={pickerKey}
                  mode="range"
                  selected={range}
                  onDayClick={handleDayClick}
                  month={month}
                  onMonthChange={setMonth}
                  numberOfMonths={isMobile ? 1 : 2}
                  pagedNavigation
                  showOutsideDays={false}
                  disabled={{ before: today }}
                  className="!m-0 w-full !p-0"
                  captionLayout="label"
                  classNames={{
                    nav: 'hidden',
                    caption_label: 'w-full pb-1 text-center text-xl font-bold',
                    months: 'flex w-full justify-between gap-16',
                    month: 'w-full flex-1',
                    caption: 'mb-3 text-center',
                    table: 'w-full text-center',
                    head_row: 'text-gray-500',
                    day: 'h-10 w-10 cursor-pointer rounded-full border-0 font-semibold transition hover:bg-sky-100',
                    day_disabled:
                      'opacity-40 cursor-not-allowed hover:bg-transparent',
                  }}
                  modifiers={{
                    start: range.from,
                    end: range.to,
                    middle:
                      range.from && range.to
                        ? { after: range.from, before: range.to }
                        : undefined,
                  }}
                  modifiersClassNames={{
                    start: 'bg-sky-400 text-white !rounded-full',
                    end: 'bg-sky-400 text-white !rounded-full',
                    middle: 'bg-sky-200 text-sky-900 !rounded-full',
                  }}
                />
              </div>

              {/* Bottom Buttons */}
              <div className="flex items-center justify-between border-t px-6 py-4">
                <button
                  className="rounded-full bg-gray-200 px-5 py-2 text-sm font-semibold hover:bg-gray-300"
                  type="button"
                  onClick={resetRange}
                >
                  Zurücksetzen
                </button>
                <button
                  className="rounded-full bg-gray-200 px-5 py-2 text-sm font-semibold hover:bg-gray-300"
                  type="button"
                  onClick={() => setShowCal(false)}
                >
                  Schließen
                </button>
              </div>
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
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-3 text-lg font-bold text-white shadow transition hover:bg-brand-light focus:outline-none sm:ml-3 sm:mt-0 sm:w-auto"
        aria-label="Suchen"
        style={{ boxShadow: '0 6px 32px 0 rgba(22,136,197,0.10)' }}
      >
        <Search className="h-5 w-5" />
        <span className="hidden sm:block">Suchen</span>
      </button>
    </form>
  )
}

'use client'

import { useState } from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  MessageSquareMore,
} from 'lucide-react'

export default function KontaktPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    agree: false,
  })

  const valid =
    form.name.trim().length >= 2 &&
    /^\S+@\S+\.\S+$/.test(form.email) &&
    form.message.trim().length >= 10 &&
    form.agree

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900)) // hier echte API integrieren
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 dark:from-[#0b1220] dark:to-[#0b1220]">
      {/* Hero / Abstand oben */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-16 sm:pt-20">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-[1.15fr_.85fr]">
          {/* Formularkarte */}
          <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow dark:border-slate-800 dark:bg-slate-900/80 md:p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  Kontaktiere uns
                </h1>
                <p className="mt-1 text-slate-600 dark:text-slate-300">
                  Fragen zur Buchung, Anbieter werden oder Feedback? Schreib
                  uns!
                </p>
              </div>
              <MessageSquareMore className="hidden h-9 w-9 text-cyan-600 dark:text-cyan-400 md:block" />
            </div>

            {sent ? (
              <div className="dark:bg-emerald-500/15 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-6 w-6" />
                <div>
                  <div className="font-semibold">Nachricht gesendet!</div>
                  <div className="text-sm">
                    Wir melden uns schnellstmöglich per E‑Mail zurück.
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                      placeholder="Max Mustermann"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                      E‑Mail
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                      placeholder="max@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Betreff
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                    placeholder="Worum geht es?"
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Nachricht
                  </label>
                  <textarea
                    className="min-h-[140px] w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                    placeholder="Schreib uns ein paar Details …"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    required
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600 dark:border-slate-600 dark:bg-slate-900"
                    checked={form.agree}
                    onChange={(e) =>
                      setForm({ ...form, agree: e.target.checked })
                    }
                    required
                  />
                  Ich stimme zu, dass meine Angaben zur Beantwortung der Anfrage
                  verarbeitet werden. Weitere Infos: Datenschutz.
                </label>

                <button
                  type="submit"
                  disabled={!valid || loading}
                  className={[
                    'group inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold shadow transition',
                    valid && !loading
                      ? 'bg-cyan-600 text-white hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400'
                      : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
                  ].join(' ')}
                >
                  <Send
                    className={[
                      'h-5 w-5 transition-transform',
                      loading
                        ? 'animate-pulse'
                        : 'group-hover:-translate-y-0.5',
                    ].join(' ')}
                  />
                  {loading ? 'Sende …' : 'Nachricht senden'}
                </button>
              </form>
            )}
          </div>

          {/* Kontaktkarte rechts */}
          <aside className="flex flex-col gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow dark:border-slate-800 dark:bg-slate-900/80">
              <h2 className="mb-2 text-lg font-extrabold text-slate-900 dark:text-white">
                Direkter Kontakt
              </h2>
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  support@boatly.app
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  +49 30 1234 5678
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  Mo–Fr 9–18 Uhr
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  Speicherstadt, Hamburg
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-300/60 bg-slate-100/70 p-5 text-slate-700 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-300">
              <div className="font-semibold text-slate-900 dark:text-white">
                Partner werden?
              </div>
              <p className="mt-1 text-sm">
                Du betreibst eine Charterbasis oder vermietest privat? Wir
                helfen dir beim Start – transparent & fair.
              </p>
              <a
                href="/signup"
                className="mt-3 inline-block rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400"
              >
                Jetzt registrieren
              </a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}

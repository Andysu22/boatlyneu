"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import { Search } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

const boatTypes = ["Alle Typen", "Segelboot", "Motorboot", "RIB", "Yacht"];

export default function SearchBar({ inHero = false }: { inHero?: boolean }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState(boatTypes[0]);
  const [dates, setDates] = useState<[Date|null,Date|null]>([null,null]);
  const [start,end] = dates;
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (type !== boatTypes[0]) params.set("type", type);
    if (start) params.set("from", start.toISOString().slice(0,10));
    if (end)   params.set("to",   end.toISOString().slice(0,10));
    router.push(`/search?${params.toString()}`);
  };

  const base = "rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand focus:outline-none";
  const pad = inHero ? "px-8 py-4 text-lg" : "px-6 py-3";

  return (
    <form
  onSubmit={onSubmit}
  className={`
    bg-white p-6 shadow-lg rounded-3xl
    grid gap-4
    grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-[2fr,1fr,1fr,auto]
    animate-fadeIn
    `}
  style={{ maxWidth: inHero ? 900 : undefined, margin: "0 auto" }}
>
  {/* Stichwort (2fr) */}
  <div className="relative">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Stichwort"
      className={`rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand focus:outline-none ${
        inHero ? "px-8 py-4" : "px-6 py-3"
      } w-full pl-14`}
    />
  </div>

  {/* Boot-Typ (1fr) */}
  <select
    value={type}
    onChange={e => setType(e.target.value)}
    className={`rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand focus:outline-none ${
      inHero ? "px-8 py-4" : "px-6 py-3"
    } w-full bg-white`}
  >
    {boatTypes.map(t => (
      <option key={t}>{t}</option>
    ))}
  </select>

  {/* Zeitraum (1fr) */}
  <DatePicker
    selectsRange
    startDate={start}
    endDate={end}
    onChange={d => setDates(d as [Date|null,Date|null])}
    isClearable
    placeholderText="Zeitraum"
    className={`rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand focus:outline-none ${
      inHero ? "px-8 py-4" : "px-6 py-3"
    } w-full`}
    calendarClassName="react-datepicker"
    popperProps={{ strategy: "fixed" }}
    popperPlacement="bottom-start"
  />

  {/* Button (auto) */}
  <button
    type="submit"
    className="bg-brand text-white font-semibold py-3 px-6 hover:bg-brand-light transition rounded-lg"
  >
    Suchen
  </button>
</form>
  );
}

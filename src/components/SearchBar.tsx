// src/components/SearchBar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import { Search } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css"; // Basis-Import

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

  const inputClass = "rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand focus:outline-none";
  const padClass   = inHero ? "px-6 py-3 text-lg" : "px-4 py-2";

  return (
    <form
      onSubmit={onSubmit}
      className={`bg-white p-4 shadow-lg rounded-2xl grid gap-3 ${
        inHero
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      }`}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          placeholder="Stichwort"
          className={`${inputClass} ${padClass} w-full`}
        />
      </div>
      <select
        value={type}
        onChange={(e)=>setType(e.target.value)}
        className={`${inputClass} ${padClass} w-full`}
      >
        {boatTypes.map(t=><option key={t}>{t}</option>)}
      </select>
      <DatePicker
        selectsRange
        startDate={start}
        endDate={end}
        onChange={(d)=>setDates(d as [Date|null,Date|null])}
        isClearable
        placeholderText="Zeitraum"
        className={`${inputClass} ${padClass} w-full`}
        calendarClassName="react-datepicker"
        /* Hier das Popper fixed machen */
        popperProps={{ strategy: "fixed" }}
        popperPlacement="bottom-start"
      />
      <button
        type="submit"
        className="bg-brand text-white font-semibold py-2 px-4 hover:bg-brand-light transition rounded-lg"
      >
        Suchen
      </button>
    </form>
  );
}

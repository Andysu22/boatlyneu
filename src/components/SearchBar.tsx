"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const boatTypes = ["Alle Typen", "Segelboot", "Motorboot", "RIB", "Yacht"];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState(boatTypes[0]);
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("query", query.trim());
    if (type !== boatTypes[0]) params.set("type", type);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Suche nach Booten"
        className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
      />
      <select
        value={type}
        onChange={e => setType(e.target.value)}
        className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-600 focus:outline-none bg-white"
      >
        {boatTypes.map(t => <option key={t}>{t}</option>)}
      </select>
      <button
        type="submit"
        className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-500 transition"
      >
        Suchen
      </button>
    </form>
  );
}

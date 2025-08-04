"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";   // falls shadcn/ui installiert
import { Button } from "@/components/ui/button";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center -mt-16 px-4"
    >
      <div className="w-full max-w-xl flex shadow-lg rounded-lg overflow-hidden">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Suche nach Booten"
          className="flex-grow"
        />
        <Button type="submit" className="px-6">
          Suchen
        </Button>
      </div>
    </form>
  );
}

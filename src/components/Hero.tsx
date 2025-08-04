"use client";
import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-700 to-amber-500" />
      <div className="relative z-10 text-center px-4 max-w-2xl">
        <h1 className="text-5xl font-extrabold text-white mb-4">
          Dein Boot. Dein Abenteuer.
        </h1>
        <p className="text-lg text-gray-100 mb-8">
          Finde und buche noch heute dein Traumboot – einfach, schnell und sicher.
        </p>
        <SearchBar />
      </div>
    </section>
  );
}

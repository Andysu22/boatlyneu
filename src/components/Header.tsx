"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`w-full transition-colors ${
        scrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
      style={{ position: "relative" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold text-brand">
          Boatly
        </Link>

        {/* Nav in der Mitte */}
        <nav className="hidden md:flex space-x-4">
          {["Boote", "Über uns", "Kontakt"].map((label) => (
            <Link
              key={label}
              href={`/${label.toLowerCase().replace(" ", "")}`}
              className="px-3 py-1 rounded-full text-slate-700 hover:bg-brand-light hover:text-white transition text-sm"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="flex items-center space-x-3">
          <Link href="/login" className="text-slate-700 hover:text-brand transition text-sm">
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-accent text-white text-sm px-3 py-1.5 rounded-full hover:bg-accent-light transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}

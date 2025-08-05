// src/components/Header.tsx
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-12 transition-colors flex items-center ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-brand">
          Boatly
        </Link>
        <nav className="space-x-6 text-gray-700 hidden md:flex">
          <Link href="/boats" className="hover:text-brand transition">Boote</Link>
          <Link href="/about" className="hover:text-brand transition">Über uns</Link>
          <Link href="/contact" className="hover:text-brand transition">Kontakt</Link>
        </nav>
        <div className="flex space-x-4 items-center">
          <Link href="/login" className="text-gray-700 hover:text-brand transition">
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-accent text-white px-3 py-1 rounded-md hover:bg-accent-light transition text-sm"
          >
            Sign Up
          </Link>
        </div>
        {/* Mobile Burger hier falls gewünscht */}
      </div>
    </header>
  );
}

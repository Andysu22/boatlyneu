"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-teal-600">
          Boatly
        </Link>
        <nav className="space-x-6 text-gray-700 hidden md:flex">
          <Link href="/boats" className="hover:text-teal-600">Boote</Link>
          <Link href="/about" className="hover:text-teal-600">Über uns</Link>
          <Link href="/contact" className="hover:text-teal-600">Kontakt</Link>
        </nav>
        <div className="space-x-4">
          <Link href="/login" className="text-gray-700 hover:text-teal-600">Login</Link>
          <Link
            href="/signup"
            className="bg-amber-500 hover:bg-amber-400 text-white px-4 py-1.5 rounded-lg transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}

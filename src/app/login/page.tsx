// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Auth-Logik hier einfügen
    router.push("/"); // nach Login weiterleiten
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 bg-white shadow-sm">
        <Link href="/" className="flex items-center space-x-2 text-brand font-extrabold">
          <ArrowLeft size={20} /> <span>Zurück</span>
        </Link>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
          <h1 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
            Melde dich an
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col relative">
              <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">
                Passwort
              </label>
              <input
                id="password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-[2.5rem] text-gray-400 hover:text-gray-600"
              >
                {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-brand text-white font-semibold py-3 rounded-lg hover:bg-brand-light transition"
            >
              Anmelden
            </button>
          </form>

          {/* Sign-up Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Noch keinen Account?{" "}
            <Link href="/signup" className="text-brand hover:underline">
              Jetzt registrieren
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

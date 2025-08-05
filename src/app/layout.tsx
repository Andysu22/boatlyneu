// src/app/layout.tsx
import "@/app/globals.css";
import { Providers } from "@/components/Providers";
import Header from "@/components/Header";
import { ReactNode } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="font-sans bg-gray-50 text-gray-800 antialiased">
        <Providers>
          <Header />
          <main className="pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

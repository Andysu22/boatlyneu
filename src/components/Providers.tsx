"use client";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <NextTopLoader color="#0d9488" height={3} />
      {children}
    </>
  );
}

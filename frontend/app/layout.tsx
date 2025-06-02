import './globals.css'
import { ReactNode } from 'react'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "######",
  description: "InvestSmart",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
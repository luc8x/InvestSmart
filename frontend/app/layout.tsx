import './globals.css'
import { ReactNode } from 'react'
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'InvestSmart',
  description: "InvestSmart",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body cz-shortcut-listen="true">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
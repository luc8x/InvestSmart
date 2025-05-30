'use client'

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "linear-gradient(135deg, var(--color-7), var(--color-9))" }}>
      <SidebarProvider >
        <AppSidebar />
        <SidebarInset className="bg-transparent">
          <div className="p-3">
            <SidebarTrigger className="bg-gray-800 p-3 mb-2 text-xs rounded-lg hover:bg-gray-700 hover:text-white transition" />
            <main className="min-h-screen rounded-lg p-3" style={{ background: "var(--color-10)" }}>
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>

  )
}
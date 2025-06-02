'use client'

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
import { useState, useMemo } from "react"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  const breadcrumbItems = useMemo(() => {
    if (!pathname) return []
    const parts = pathname.split("/").filter(Boolean)
    const crumbs = parts.map((part, idx) => {
      const href = "/" + parts.slice(0, idx + 1).join("/")
      const label = capitalize(part.replace(/-/g, " "))
      return { href, label }
    })
    return [{ href: "/", label: "Home" }, ...crumbs]
  }, [pathname])

  return (
    <div
      className={`min-h-screen ${collapsed ? "sidebar-collapsed" : ""}`}
      style={{
        background: "linear-gradient(135deg, var(--color-7), var(--color-9))",
      }}
    >
      <SidebarProvider>
        <AppSidebar collapsed={collapsed} />
        <SidebarInset className="bg-transparent" style={{ marginLeft: "0" }}>
          <div className="p-2">
            <main
              className="rounded-lg p-3"
              style={{ background: "var(--color-10)" }}
            >
              <div className="flex gap-3 items-center mb-3">
                <SidebarTrigger
                  className="p-3 text-xs rounded-lg hover:bg-gray-700 hover:text-white transition"
                  onClick={() => setCollapsed((prev) => !prev)}
                />

                <span>|</span>

                <Breadcrumb>
                  <BreadcrumbList>
                  {breadcrumbItems.map((item, index) => {
                    const isLast = index === breadcrumbItems.length - 1
                    return (
                    <>
                      <BreadcrumbItem key={item.href}>
                      <BreadcrumbLink
                        href={item.href}
                        className={isLast ? "text-gray-300 font-semibold pointer-events-none cursor-default" : "hover:text-gray-400"}
                        aria-current={isLast ? "page" : undefined}
                      >
                        {item.label}
                      </BreadcrumbLink>
                      </BreadcrumbItem>
                      {index < breadcrumbItems.length - 1 && (
                      <BreadcrumbSeparator key={`sep-${item.href}`} />
                      )}
                    </>
                    )
                  })}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

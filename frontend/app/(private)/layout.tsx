'use client'

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Input,
} from "@/components/ui/input"
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
import { Layout } from "@/components/layoutContainer"
import React from "react"

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
    return [{ href: "/", label: "InvestSmart" }, ...crumbs]
  }, [pathname])

  return (
    <Layout collapsed={collapsed}>
      <SidebarProvider>
        <AppSidebar collapsed={collapsed} />
        <SidebarInset
          className="bg-transparent"
          style={{
            marginLeft: 0,
            boxShadow: "unset",
            // @ts-ignore
            "--tw-shadow": "unset",
          }}
        >
          <div className="p-2">
            <main
              className="rounded-lg p-3 backdrop-blur"
              style={{ background: "linear-gradient(135deg, #2C3136, var(--color-10))" }}
            >
              <div className="flex gap-3 items-center mb-3 justify-between px-4">
                <div className="flex gap-3 items-center">
                  <SidebarTrigger
                    className="p-3 text-xs rounded-lg hover:bg-gray-700 hover:text-white transition"
                    onClick={() => setCollapsed((prev) => !prev)}
                  />

                  <span>|</span>

                  <Breadcrumb>
                    <BreadcrumbList>
                      {breadcrumbItems.map((item, index) => {
                        const isLast = index === breadcrumbItems.length - 1;
                        return (
                          <React.Fragment key={item.href}>
                            <BreadcrumbItem>
                              <BreadcrumbLink
                                href={item.href}
                                className={
                                  isLast
                                    ? "text-gray-300 font-semibold pointer-events-none cursor-default drop-shadow-[0_0_3px_rgba(144,146,148,0.3)]"
                                    : "hover:text-gray-400"
                                }
                                aria-current={isLast ? "page" : undefined}
                              >
                                {item.label}
                              </BreadcrumbLink>
                            </BreadcrumbItem>
                            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                          </React.Fragment>
                        );
                      })}
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
                <div><Input type="text" placeholder="Procurar" className="h-8" /></div>
              </div>
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Layout>
  )
}

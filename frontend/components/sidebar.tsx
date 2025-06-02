'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Home } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function AppSidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <Sidebar
      collapsible="icon"
      className="text-white transition-all duration-300 ease-in-out"
      variant="inset"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="px-2 py-1 rounded-md hover:bg-gray-800 hover:text-white active:bg-gray-800 active:text-white">
              <Link
                href="/inicio"
                className={`flex items-center gap-3 transition ${collapsed ? 'hover:bg-transparent' : ''}`}
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image src="/img/logo.png" alt="Logo" width={30} height={30} />
                </div>

                <div className={`flex flex-col leading-none ${collapsed ? "hidden" : ""}`}>
                  <span className="text-sm font-semibold truncate">######</span>
                  <span className="text-xs text-muted-foreground truncate">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="pr-0">
          <SidebarGroupLabel className="text-xs uppercase tracking-wide text-gray-400 px-3">
            Menu
          </SidebarGroupLabel>
          <hr className="my-2 border-gray-600" />

          <SidebarMenu className="space-y-1">
            <SidebarMenuItem>
              <SidebarLink href="/inicio" icon={<Home size={18} />} label="Início" collapsed={collapsed} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

interface SidebarLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  collapsed: boolean
}

export function SidebarLink({ href, icon, label, collapsed }: SidebarLinkProps) {

  return (
    <Link href={href} className="block w-full">
      <SidebarMenuButton
        tooltip={label}
        aria-label={label}
        className={`flex items-center gap-2 text-sm transition ${collapsed ? "justify-center px-5" : "justify-start px-3"
          }`}
      >
        <span className="text-base">{icon}</span>
        {!collapsed && <span className="truncate">{label}</span>}
      </SidebarMenuButton>
    </Link>
  )
}
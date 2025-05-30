'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarFooter,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Home, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="text-white" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Image src="/img/logo.png" alt="Logo" width={30} height={30} />
              </div>
              <div className="grid flex text-left text-sm">
                <span className="truncate font-medium">
                  <p className="font-bold leading-none">Sistema</p>
                </span>
                <span className="truncate text-xs text-white/70">v.0.0.1</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="pr-0">
          <SidebarGroupLabel className="text-gray-400">Menu</SidebarGroupLabel>
          <hr />
          <SidebarMenu className="mt-2 gap-3">
            <SidebarMenuItem>
              <SidebarLink
                href="/inicio"
                icon={<Home size={20} />}
                label="Início"
              />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarLink
                href="/dashboard"
                icon={<FileText size={20} />}
                label="Dashboard"
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function SidebarLink({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center text-sm w-auto",
      )}
    >
      <SidebarMenuButton tooltip={label}>
        {icon}{label}
      </SidebarMenuButton>
    </Link>
  )
}

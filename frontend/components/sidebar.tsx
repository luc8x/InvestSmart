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
import {
  Home,
  Landmark,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from 'next/navigation'

export function AppSidebar({ collapsed }: { collapsed: boolean }) {

  return (
    <Sidebar
      collapsible="icon"
      className="text-white transition-all duration-300 ease-in-out"
      variant="inset"
    >
      <SidebarHeader className="py-1 px-0">
      <Link
        href="/"
        className={`flex items-center gap-3 rounded-md transition-colors hover:bg-muted ${collapsed ? "ml-2.5 p-0" : "ml-1.5 py-1 px-1"}`}>
        <div className="flex items-center justify-center w-9 h-9 rounded-md text-sidebar-primary-foreground">
          <Image
            src="/img/logo_black.png"
            alt="Logo"
            width={24}
            height={24}
            className="object-contain"
          />
        </div>

        {!collapsed && (
          <span className="text-base font-semibold text-foreground truncate">
            InvestSmart
          </span>
        )}
      </Link>
    </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="pr-0">
          <SidebarGroupLabel className="text-gray-800 px-3">
            Menu
          </SidebarGroupLabel>

          <SidebarMenu className="space-y-1">
            <SidebarMenuItem>
              <SidebarLink href="/painel" icon={<Home size={18} />} label="Painel" collapsed={collapsed} />
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarLink href="/bancos" icon={<Landmark size={18} />} label="Banco" collapsed={collapsed} />
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
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <a
      href={href}
      className={`flex w-full transition-all duration-300 ${collapsed ? 'pl-1' : ''}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <SidebarMenuButton
      tooltip={collapsed ? label : undefined}
      aria-label={label}
      className={`flex items-center gap-2 text-sm transition-all duration-300 rounded-md px-2 py-1 text-black ${isActive ? 'bg-muted text-primary font-semibold' : ''}`}
      >
      <span className="text-base flex items-center justify-center w-5 h-5">
        {icon}
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
      </SidebarMenuButton>
    </a>
  )
}
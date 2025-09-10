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
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utilities/utils"
import {
  Home,
  Landmark,
  PiggyBank,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from 'next/navigation'

export function AppSidebar({ isTransitioning }: { isTransitioning?: boolean }) {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <Sidebar
      collapsible="icon"
      className="text-white transition-all duration-300 ease-in-out"
      variant="inset"
    >
      <SidebarHeader className="py-1 px-0">
      <Link
        href="/"
        className={`flex items-center gap-3 rounded-md transition-colors ${collapsed ? "ml-4.5 p-0" : "ml-1.5 py-1 px-1"}`}>
        <div className="flex items-center justify-center w-9 h-9 rounded-md text-sidebar-primary-foreground">
          <Image
            src="/img/logo_white.png"
            alt="Logo"
            width={24}
            height={24}
            className="object-contain"
          />
        </div>

        <span
          className={cn(
            "text-white inline-block overflow-hidden whitespace-nowrap",
            "transition-[max-width] duration-300 ease-in-out",
            "transition-opacity duration-100 ease-in-out",
            collapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"
          )}
        >
          InvestSmart
        </span>
      </Link>
    </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="pr-0">
          <SidebarGroupLabel className="text-gray-100 px-3">
            Menu
          </SidebarGroupLabel>

          <SidebarMenu className="space-y-1">
            <hr className="my-2 border-white/30" />
            <SidebarMenuItem>
              <SidebarLink href="/painel" icon={<Home size={20} />} label="Painel" isTransitioning={isTransitioning} />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarLink href="/bancos" icon={<Landmark size={20} />} label="Banco" isTransitioning={isTransitioning} />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarLink href="/investimentos" icon={<PiggyBank size={20} />} label="Investimentos" isTransitioning={isTransitioning} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export function SidebarLink({ href, icon, label, isTransitioning }: { href: string, icon: React.ReactNode, label: string, isTransitioning?: boolean }) {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
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
        className={`flex items-center gap-2 transition-all duration-300 text-white/50 hover:bg-white/10 hover:border-white/20 ${isActive ? 'bg-white/10 text-white border border-white/20' : 'hover:text-white/90'}`}
      >
      <span className="text-base flex items-center justify-center w-5 h-5">
        {icon}
      </span>
      <span className={`transition-all duration-800 ease-in-out ${
        collapsed && !isTransitioning 
          ? 'opacity-0 -translate-x-2 max-w-0 overflow-hidden' 
          : isTransitioning && !collapsed
          ? 'opacity-0 -translate-x-2 max-w-0 overflow-hidden'
          : 'opacity-100 translate-x-0 max-w-200 delay-75'
      }`}>
        {label}
      </span>
      </SidebarMenuButton>
    </a>
  )
}
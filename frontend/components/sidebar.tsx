'use client'

import { getInitials } from '@/utils/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  ChevronsUpDown,
  LogOut,
  Landmark,
  CircleUser,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'
import { getUserFromCookies, logoutUser } from '@/utils/usersServices';

export function AppSidebar({ collapsed }: { collapsed: boolean }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData:any = getUserFromCookies();
    if (userData) {
      setUser(userData);
    }
  }, []);


  const handleLogout = async () => {
    await logoutUser();
  };

  const { isMobile } = useSidebar()
  return (
    <Sidebar
      collapsible="icon"
      className="text-white transition-all duration-300 ease-in-out"
      variant="inset"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className='pl-1'>
            <SidebarMenuButton size="lg" asChild className="px-2 py-1 rounded-md hover:bg-gray-800 hover:text-white active:bg-gray-800 active:text-white">
              <Link
                href="/"
                className={`flex items-center gap-3 transition ${collapsed ? 'hover:bg-transparent' : ''}`}
              >
                <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image src="/img/logo.png" alt="Logo" width={30} height={30} />
                </div>

                <div className={`flex flex-col leading-none ${collapsed ? "hidden" : ""}`}>
                  <span className="text-sm font-semibold truncate">InvestSmart</span>
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
              <SidebarLink href="/painel" icon={<Home size={18} />} label="Painel" collapsed={collapsed} />
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarLink href="/bancos" icon={<Landmark size={18} />} label="Banco" collapsed={collapsed} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  style={{ background: 'var(--color-10)' }}
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/img/logo.png" alt="{}" />
                    <AvatarFallback className="rounded-lg">
                      {getInitials(user?.nome_completo || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user?.nome_completo}
                    </span>
                    <span className="truncate text-xs">
                      Usuário
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="" alt="" />
                      <AvatarFallback className="rounded-lg">
                        {getInitials(user?.nome_completo || '')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user?.nome_completo}</span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                  <DropdownMenuItem>
                  <a href={'/perfil'} className='w-full'>
                  <div className='flex gap-2'>
                      <CircleUser  />
                      Perfil
                  </div>
                  </a>
                  </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>
                  <LogOut />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
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
    <a href={href} className="block w-full pl-1">
      <div className={`rounded-sm ${collapsed ? 'w-8 h-8' : ''}`}>
        <SidebarMenuButton
          tooltip={label}
          aria-label={label}
          className={`flex items-center gap-2 text-sm transition rounded-sm
            ${collapsed 
              ? "justify-start px-0 w-6 h-6" 
              : "justify-start px-2"}
            ${isActive ? 'bg-gray-700 text-white font-semibold' : 'hover:bg-gray-400 hover:text-accent-foreground'}`}
        >
          <span className="text-base flex items-center w-6 h-6">{icon}</span>
          {!collapsed && <span className="truncate">{label}</span>}
        </SidebarMenuButton>
      </div>
    </a>
  );
}
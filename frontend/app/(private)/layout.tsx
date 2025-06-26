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
import { useState, useMemo, useEffect } from "react"
import { usePathname } from "next/navigation"
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
  LogOut,
  CircleUser,
  Search,
} from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Layout } from "@/components/layoutContainer"
import React from "react"
import { getUserFromCookies, logoutUser } from '@/utils/usersServices';
import { getInitials } from "@/utils/utils"

export default function PrivateLayout({ children }: { children: React.ReactNode }) {

  const [collapsed, setCollapsed] = useState(false);
  const [foto, setFoto] = useState();
  const [user, setUser] = useState();
  
  useEffect(() => {
      setFoto(localStorage.getItem("user_foto"))
      const { user: userData, perfil: p } = getUserFromCookies();
      if (userData) {
        setUser(userData);
      }
    }, []);

  const handleLogout = async () => {
    await logoutUser();
  };

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
          <div className="p-2 h-full overflow-y-auto">
            <main
              className="rounded-lg p-3 backdrop-blur h-full overflow-y-auto"
              style={{ background: "#FCFFFE" }}
            >
              <div className="flex gap-3 items-center mb-3 justify-between">
                <div className="flex gap-3 items-center">
                  <SidebarTrigger
                    className="p-3 text-xs text-black rounded-lg hover:bg-[#2B3230] hover:text-white transition"
                    onClick={() => setCollapsed((prev) => !prev)}
                  />

                  <span className="text-black">|</span>

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
                                    ? "text-black font-semibold pointer-events-none cursor-default"
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
                <div className="flex gap-2 items-center">
                  

                  <div className="relative">
                      <Input type="text" placeholder="Procurar" className="pr-10" />
                      <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400/60" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={foto || '/img/avatar-placeholder.png'}
                          alt="Foto do usuário"
                          className="h-8 w-8 rounded-full border border-gray-300"
                        />
                        <AvatarFallback className="rounded-lg">
                          {getInitials(user?.nome_completo || '')}
                        </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="min-w-56 rounded-lg"
                      align="end"
                      sideOffset={4}
                    >
                      <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage
                                src={foto || '/img/avatar-placeholder.png'}
                              alt="Foto do usuário"
                              className="h-8 w-8 rounded-full border border-gray-300"
                            />
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
                            <CircleUser />
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
                </div>
              </div>
              <div className="p-5 bg-gray-100 rounded-lg border border-gray-300">
                {children}
              </div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Layout>
  )
}

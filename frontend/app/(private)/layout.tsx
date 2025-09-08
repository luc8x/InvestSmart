'use client'

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { AppSidebar } from "@/components/Sidebar/sidebar"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogOut, CircleUser, Search } from "lucide-react"
import { Layout } from "@/components/LayoutBase/layoutContainer"
import React from "react"
import { logoutUser } from "@/lib/userServices/usersServices"


export default function PrivateLayout({ children }: { children: React.ReactNode }) {

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [foto, setFoto] = useState();



  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <Layout>
      <SidebarProvider>
        <AppSidebar isTransitioning={isTransitioning} />
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
            <main className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full transition-all duration-300 ease-in-out">
              <div className="flex gap-3 items-center mb-5 justify-between">
                <div className="group">
                  <SidebarTrigger 
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group-hover:scale-105"
                  />
                </div>
                
                <div className="flex gap-3 items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="cursor-pointer group">
                        <Avatar className="h-10 w-10 ring-2 ring-white/20 hover:ring-white/40 transition-all duration-300 group-hover:scale-105">
                          <AvatarImage
                            src={foto || '/img/avatar-placeholder.png'}
                            alt="Foto do usuário"
                            className="h-10 w-10 rounded-full"
                          />
                          <AvatarFallback className="bg-white/10 backdrop-blur-sm text-gray-700 border-0">
                            {/* {getInitials(user?.nome_completo || '')} */}
                            US
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="min-w-56 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-gray-700 shadow-xl"
                      align="end"
                      sideOffset={8}
                    >
                      <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-3 px-3 py-3 text-left">
                          <Avatar className="h-10 w-10 ring-2 ring-white/20">
                            <AvatarImage
                              src={foto || '/img/avatar-placeholder.png'}
                              alt="Foto do usuário"
                              className="h-10 w-10 rounded-full"
                            />
                            <AvatarFallback className="bg-white/10 backdrop-blur-sm text-gray-700 border-0">
                              {/* {getInitials(user?.nome_completo || '')} */}
                              US
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid flex-1 text-left leading-tight">
                            <span className="font-medium text-gray-700">Nome do Usuário</span>
                            <span className="text-xs text-gray-700/70">usuario@email.com</span>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/20" />
                      <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 text-gray-700 transition-colors duration-200">
                        <a href={'/perfil'} className='w-full'>
                          <div className='flex gap-2 items-center'>
                            <CircleUser size={16} />
                            Perfil
                          </div>
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout} className='cursor-pointer hover:bg-white/10 focus:bg-white/10 text-gray-700 transition-colors duration-200'>
                        <div className='flex gap-2 items-center'>
                          <LogOut size={16} />
                          Sair
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="relative p-7 bg-gray-100 backdrop-blur-sm rounded-xl border border-gray-300/50 shadow-sm">
                {children}
              </div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Layout>
  )
}

'use client'
import { ReactNode } from 'react'

export function Layout({ children, collapsed }: { children: ReactNode; collapsed: boolean }) {
    return (
        <div
            className={`
                min-h-screen
                relative
                overflow-hidden
                ${collapsed ? 'sidebar-collapsed' : ''}
                bg-gradient-to-r from-[#001953] to-[#060840]
            `}
        >
            {/* conteúdo principal */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}

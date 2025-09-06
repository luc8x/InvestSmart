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
                bg-gradient-to-r from-[#260c57] to-[#020d6b]
            `}
        >
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}

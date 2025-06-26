'use client'
import { ReactNode } from 'react'

export function Layout({ children, collapsed }: { children: ReactNode; collapsed: boolean }) {
    return (
            <div
                className={`min-h-screen ${collapsed ? 'sidebar-collapsed' : ''}`}
                style={{ background: '#E3E9F0' }}
            >
                {children}
            </div>
    )
}
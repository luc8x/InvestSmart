'use client'
import { ReactNode } from 'react'

export function Layout({ children, collapsed }: { children: ReactNode; collapsed: boolean }) {
    return (
            <div
                className={`min-h-screen ${collapsed ? 'sidebar-collapsed' : ''}`}
                style={{ background: 'linear-gradient(135deg, #2C2C2C, var(--color-9))' }}
            >
                {children}
            </div>
    )
}
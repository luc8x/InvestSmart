'use client'
import { ReactNode } from 'react'
import { MousePositionProvider } from './mouseEffectCard'

export function Layout({ children, collapsed }: { children: ReactNode; collapsed: boolean }) {
    return (
        <MousePositionProvider>
            <div
                className={`min-h-screen ${collapsed ? 'sidebar-collapsed' : ''}`}
                style={{ background: 'linear-gradient(135deg, #2C2C2C, var(--color-9))' }}
            >
                {children}
            </div>
        </MousePositionProvider>
    )
}
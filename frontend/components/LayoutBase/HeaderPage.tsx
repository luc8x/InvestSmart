'use client'
import { ReactNode } from 'react'

export function HeaderLayout({ moduleName, description }: { moduleName: ReactNode; description: ReactNode }) {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight">{moduleName}</h1>
            <p className="text-muted-foreground">
                {description}
            </p>
        </div>
    )
}

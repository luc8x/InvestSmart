'use client'
import { useRef, useEffect, useState, createContext, useContext, ReactNode } from 'react'

type MousePos = { x: number; y: number }

// Context para posição do mouse global
const MouseContext = createContext<MousePos>({ x: -9999, y: -9999 })

export function MousePositionProvider({ children }: { children: ReactNode }) {
  const [pos, setPos] = useState<MousePos>({ x: -9999, y: -9999 })

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return <MouseContext.Provider value={pos}>{children}</MouseContext.Provider>
}

export function useMousePosition() {
  return useContext(MouseContext)
}

interface CardProps {
  children: ReactNode
  className?: string
  radius?: number
}

export function MouseEffectCard({
  children,
  className = '',
  radius = 160,
  style,
}: CardProps & { style?: React.CSSProperties }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouse = useMousePosition()

  const [localPos, setLocalPos] = useState({ x: 0, y: 0, opacity: 0 })

  useEffect(() => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 5
    const centerY = rect.top + rect.height / 5

    const dx = mouse.x - centerX
    const dy = mouse.y - centerY
    const distance = Math.sqrt(dx + dy)

    if (distance > radius) {
      if (localPos.opacity !== 0) {
        setLocalPos(pos => ({ ...pos, opacity: 0 }))
      }
      return
    }
    
    const x = mouse.x - rect.left
    const y = mouse.y - rect.top

    const opacity = Math.pow(Math.max(0, 1 - distance / radius), 1.6)

    setLocalPos({ x, y, opacity })
  }, [mouse, radius])

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={style}
    >
      {children}
      <div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          opacity: localPos.opacity,
          transition: 'opacity 0.3s ease',
          background: `radial-gradient(circle at ${localPos.x}px ${localPos.y}px, rgba(92, 92, 92, 0.10), transparent 30%)`,
          borderRadius: 'inherit',
        }}
      />
    </div>
  )
}
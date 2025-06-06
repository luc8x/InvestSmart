'use client'
import { useRef, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface MouseEffectCardProps {
  children: ReactNode
  className?: string
}

export function MouseEffectCard({ children, className = '' }: MouseEffectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [showEffect, setShowEffect] = useState(false)

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cardRef.current.style.setProperty('--mouse-x', `${x}px`)
    cardRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  const handleMouseEnter = () => {
    setShowEffect(true)
  }

  const handleMouseLeave = () => {
    setShowEffect(false)
  }

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className={`pointer-events-none absolute left-0 top-0 h-full w-full transition-opacity duration-300 ${showEffect ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: 'radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.2), transparent 60%)'
        }}
      />
      {children}
    </div>
  )
}

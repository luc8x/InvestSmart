import { useEffect } from 'react'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export function isAuthenticated() {
  const cookieStore = cookies()
  const token = cookieStore.get('access_token')

  if (!token) return false

  try {
    const decoded = jwt.decode(token.value)
    return decoded && decoded.exp * 1000 > Date.now()
  } catch {
    return false
  }
}


async function tryRefreshToken() {
  const res = await fetch('http://127.0.0.1:8001/api/token/refresh-cookie/', {
    method: 'POST',
    credentials: 'include',
  })

  if (res.ok) {
    const data = await res.json()
    return data.access
  } else {
    throw new Error('Sessão expirada. Refaça o login.')
  }
}

export function useAutoRefresh() {
  useEffect(() => {
    const interval = setInterval(() => {
      tryRefreshToken().catch(() => {
        window.location.href = '/'
      })
    }, 1000 * 60 * 15) // a cada 15 minutos

    return () => clearInterval(interval)
  }, [])
}

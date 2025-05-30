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

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = [
  { path: '/login', whenAuthed: 'redirect' },
  { path: '/cadastre-se', whenAuthed: 'redirect' }
]

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/login'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get('access_token')?.value

  const publicRoute = publicRoutes.find(route => route.path === pathname)

  if (!token && publicRoute) {
    return NextResponse.next()
  }

  if (!token && !publicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE
    return NextResponse.redirect(url)
  }

  if (token && publicRoute?.whenAuthed === 'redirect') {
    const url = request.nextUrl.clone()
    url.pathname = '/painel'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/token/refresh-cookie|api|img|gif).*)',
  ],
}
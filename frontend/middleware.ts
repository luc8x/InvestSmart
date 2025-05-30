// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = [
  { path: '/', whenAuthed: 'redirect' },         // login
  { path: '/cadastre-se', whenAuthed: 'redirect' }
]

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/' // login

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')

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
    url.pathname = '/inicio'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api).*)',
  ],
}
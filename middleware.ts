import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { hasStoreData } from './src/lib/auth'

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user')
  const path = request.nextUrl.pathname

  // Check if path starts with /admin
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    try {
      const userData = JSON.parse(user.value)
      if (userData.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  // Check vendor access for dashboard routes
  if (path.startsWith('/dashboard') && !path.startsWith('/dashboard/account')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    try {
      const userData = JSON.parse(user.value)
      if (userData.role === 'Vendor' && !hasStoreData(userData)) {
        return NextResponse.redirect(new URL('/dashboard/account', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*']
}


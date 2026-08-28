import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for the admin session cookie
  const adminSession = request.cookies.get('admin_session')?.value;
  const isAuthenticated = adminSession === 'authenticated';

  // If path is under /admin
  if (pathname.startsWith('/admin')) {
    // Exclude /admin/login from authentication check to prevent redirect loops
    if (pathname === '/admin/login') {
      // If already logged in, redirect away from login page to dashboard overview
      if (isAuthenticated) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // If not authenticated, redirect to the admin login page
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Config to specify matching routes
export const config = {
  matcher: ['/admin/:path*'],
};

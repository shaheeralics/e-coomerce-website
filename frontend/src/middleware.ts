import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('MIDDLEWARE RUNNING FOR PATH:', pathname);

  // Check for the admin session cookie
  const adminSession = request.cookies.get('admin_session')?.value;
  const isAuthenticated = adminSession === 'authenticated';

  // If path is under /admin
  if (pathname.startsWith('/admin')) {
    // If not authenticated, redirect to the main login page
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Config to specify matching routes
export const config = {
  matcher: ['/admin/:path*'],
};

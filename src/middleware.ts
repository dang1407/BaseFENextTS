import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Định nghĩa các routes cần bảo vệ
const protectedRoutes = ['/', '/dashboard', '/editor', '/settings'];

export function middleware(request: NextRequest) {
  console.log("Middleware running for:", request.nextUrl.pathname);
  const { pathname } = request.nextUrl;

  // Kiểm tra xem route hiện tại có cần bảo vệ không
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // // Kiểm tra token trong cookies
    // const token = request.cookies.get('EshustAccessToken03Hdx');
    // if (!token) {
    //   const url = new URL('/login', request.url);
    //   // url.searchParams.set('from', pathname);
    //   return NextResponse.redirect(url);
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/editor/:path*',
    '/settings/:path*'
  ]
};

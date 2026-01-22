import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

const authRoutes = ['/login', '/signup'];
const protectedRoutes = ['/read'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If authenticated user tries to access login/signup, redirect to /read
  if (session && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/read', request.url));
  }

  // If unauthenticated user tries to access protected pages, redirect to /login
  if (!session && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/read', '/login', '/signup'], // Specify the routes the middleware applies to
};

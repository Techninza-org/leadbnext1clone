import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { loggedUserSchema } from './types/auth';

export async function middleware(request: NextRequest) {
  const currentUserToken = request.cookies.get('x-lead-token')?.value;
  const currentUser = request.cookies.get('x-lead-user')?.value;
  let user: z.infer<typeof loggedUserSchema> | null = null;

  if (currentUserToken && currentUser) {
    try {
      user = JSON.parse(currentUser) as z.infer<typeof loggedUserSchema>;
    } catch (error) {
      console.error('Invalid token: [MIDDLEWARE]', error);
    }
  }

  const isAuthenticated = !!currentUserToken;
  const userRole = user?.role?.name?.split(" ").join("").toLowerCase();

  const unauthenticatedPaths = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/admin/login',
  ];
  
  const adminPaths = [
    '/admin',
    '/admin/dashboard',
    // Add more admin paths as needed
  ];
  
  const rootManagerPaths = [
    '/dashboard',
    '/follow-up',
    '/xchange-customer-list',
    '/xchange-list',
    '/lead-imgs',
    '/pay-receipt',
    '/prospect',
    '/bids',
    '/leads',
    '/members',
    '/leads/transfered',
    '/track',
    '/broadcast',
    '/departments',
    '/lead.csv'
    // Add more paths for root and manager
  ];
  
  const managerPaths = [
    '/dashboard',
    '/leads',
    '/leads/transfered',
    '/track',
    '/broadcast',
    '/lead.csv'
    
    // Add more paths for root and manager
  ];

  const { pathname } = request.nextUrl;

  // Exclude favicon.ico from authentication checks
  if (pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // Allow access to public routes without authentication
  if (unauthenticatedPaths.some(path => pathname.startsWith(path))) {
    // Redirect authenticated users away from unauthenticated paths
    if (isAuthenticated) {
      return redirectToDashboard(userRole, request);
    }
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login page
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based access control
  if (userRole === 'admin') {
    if (!adminPaths.some(path => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  } else if (userRole === 'root') {
    if (!rootManagerPaths.some(path => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else if (userRole === 'manager') {
    if (!managerPaths.some(path => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else if (userRole) {
    if (!pathname.startsWith(`/${userRole}`)) {
      return NextResponse.redirect(new URL(`/${userRole}/leads`, request.url));
    }
  } else {
    // For other roles or unrecognized roles, redirect to a generic access-denied page
    return NextResponse.redirect(new URL('/access-denied', request.url));
  }

  // Allow access to paths matching the role-specific conditions
  return NextResponse.next();
}

function redirectToDashboard(userRole: string | undefined, request: NextRequest) {
  switch (userRole) {
    case 'admin':
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    case 'root':
    case 'manager':
      return NextResponse.redirect(new URL('/dashboard', request.url));
    default:
      return NextResponse.redirect(new URL(`/${userRole}/leads`, request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|\\.png$|images).*)'],
};

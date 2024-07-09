import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { loggedUserSchema } from './types/auth';

export async function middleware(request: NextRequest) {
  const currentUserToken = request.cookies.get('x-lead-token')?.value;
  let user: z.infer<typeof loggedUserSchema> | null = null;

  if (currentUserToken) {
    try {
      user = JSON.parse(currentUserToken) as z.infer<typeof loggedUserSchema>;
      console.log(user, "user")
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }

  const isAuthenticated = user !== null;
  const userRole = user?.role.name;

  const unauthenticatedPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/admin/login'];


  const adminPaths = [
    '/admin',
    // Add more admin paths as needed
  ];

  const rootManagerPaths = [
    `/${userRole}/dashboard`,
    // Add more paths for root and manager
  ];

  const { pathname } = request.nextUrl;

  // Exclude favicon.ico from authentication checks
  // if (pathname === '/favicon.ico') {
  //   return NextResponse.next();
  // }

  // // Allow access to public routes without authentication
  // if (unauthenticatedPaths.some(path => pathname.startsWith(path))) {
  //   return NextResponse.next();
  // }

  // // Redirect unauthenticated users to login page
  // if (!isAuthenticated) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  // // Role-based access control
  // if (userRole === 'admin') {
  //   if (!adminPaths.some(path => pathname.startsWith(path))) {
  //     return NextResponse.redirect(new URL('/access-denied', request.url));
  //   }
  // } else if (userRole?.toLowerCase() !== 'manager'){
  //     return NextResponse.redirect(new URL('/nof-', request.url));
  // } else if (userRole === 'root' || userRole === 'manager') {
  //   if (!rootManagerPaths.some(path => pathname.startsWith(path))) {
  //     return NextResponse.redirect(new URL('/access-denied', request.url));
  //   }
  // } else {
  //   // For other roles, allow access to all paths
  //   return NextResponse.next();
  // }

  // Handle other scenarios by default (e.g., allow access to specific paths)
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|\\.png$).*)'],
};


// import { NextRequest, NextResponse } from 'next/server';
// import { z } from 'zod';
// import { loggedUserSchema } from './types/auth';

// export async function middleware(request: NextRequest) {
//   const currentUserToken = request.cookies.get('x-lead-token')?.value;
//   let user: z.infer<typeof loggedUserSchema> | null = null;
  
//   if (currentUserToken) {
//     try {
//       user = JSON.parse(currentUserToken) as z.infer<typeof loggedUserSchema>;
//       console.log(user, "user")
//     } catch (error) {
//       console.error('Invalid token:', error);
//     }
//   }
//   let isAuthenticated = user !== null;
//   let userRole = user?.role.name;

//   const unauthenticatedPaths = ['/login', '/signup', '/forgot-password', '/reset-password', '/admin/login'];
//   const membersPath = [
//     '/dashboard',
//     '/leads',

//     // public files
//     // '/filename.csv',
//   ];

//   const root_manager_path = [
//     '/dashboard',
//     '/leads',

//     // public files
//     // '/filename.csv',
//   ];

//   const adminRoutes = [
//     '/admin',
//   ];

//   // const publicRoutes = [
//   //   '',
//   // ];

//   const { pathname } = request.nextUrl;

//   // Exclude favicon.ico from authentication checks
//   if (pathname === '/favicon.ico') {
//     return NextResponse.next();
//   }

//   // Allow access to public routes without authentication
//   // if (publicRoutes.some(route => pathname.startsWith(route))) {
//   //   return NextResponse.next();
//   // }

//   // Redirect unauthenticated users to login page
//   // if (!isAuthenticated && !unauthenticatedPaths.some(path => pathname.startsWith(path))) {
//   //   return NextResponse.redirect(new URL('/login', request.url));
//   // }

//   // if (isAuthenticated) {
//   //   // Role-based access control
//   //   if (userRole === 'seller') {
//   //     if (adminRoutes.some(route => pathname.startsWith(route))) {
//   //       return NextResponse.redirect(new URL('/access-denied', request.url));
//   //     }
//   //     if (pathname.includes('/login')) {
//   //       return NextResponse.redirect(new URL('/dashboard', request.url));
//   //     }
//   //   } else if (userRole === 'root' || userRole === 'admin') {
//   //     if (pathname.includes('/login')) {
//   //       return NextResponse.redirect(new URL('/admin/shipment-listing', request.url));
//   //     }
//   //   }

//   //   // Redirect authenticated users to the appropriate dashboard if they try to access unauthenticated paths
//   //   if (!authenticatedRoutes.some(route => pathname.startsWith(route)) && !adminRoutes.some(route => pathname.startsWith(route))) {
//   //     if (userRole === 'seller') {
//   //       return NextResponse.redirect(new URL('/dashboard', request.url));
//   //     } else if (userRole === 'admin') {
//   //       return NextResponse.redirect(new URL('/admin/shipment-listing', request.url));
//   //     }
//   //   }
//   // }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|\\.png$).*)'],
// };
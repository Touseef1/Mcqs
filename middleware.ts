// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { verifyToken } from '@/lib/auth';

// export async function middleware(request: NextRequest) {
//   const token = request.cookies.get('token')?.value;
//   const { pathname } = request.nextUrl;

//   // Public routes
//   const publicRoutes = ['/', '/login', '/register'];
  
//   // Role-based routes
//   const adminRoutes = ['/admin'];
//   const administratorRoutes = ['/administrator'];

//   // Handle root path
//   if (pathname === '/') {
//     return NextResponse.next();
//   }

//   // Auth pages
//   if (publicRoutes.includes(pathname)) {
//     if (token) {
//       try {
//         const decoded = await verifyToken(token);
//         return NextResponse.redirect(new URL(`/${decoded.role}`, request.url));
//       } catch (error) {
//         return NextResponse.next();
//       }
//     }
//     return NextResponse.next();
//   }

//   // Protected routes
//   if (!token) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   try {
//     const decoded = await verifyToken(token);
    
//     // Redirect to role-specific dashboard if trying to access root dashboard
//     if (pathname === '/dashboard') {
//       return NextResponse.redirect(new URL(`/${decoded.role}`, request.url));
//     }

//     // Admin route protection
//     if (adminRoutes.some(route => pathname.startsWith(route)) && decoded.role !== 'admin') {
//       return NextResponse.redirect(new URL('/', request.url));
//     }

//     // Administrator route protection
//     if (administratorRoutes.some(route => pathname.startsWith(route)) && decoded.role !== 'administrator') {
//       return NextResponse.redirect(new URL('/', request.url));
//     }
    
//     return NextResponse.next();
//   } catch (error) {
//     const response = NextResponse.redirect(new URL('/login', request.url));
//     response.cookies.delete('token');
//     return response;
//   }
// }


import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Define route access rules
  const publicRoutes = ['/', '/login', '/register'];
  const adminOnlyRoutes = ['/admin'];
  const administratorOnlyRoutes = ['/administrator']; // e.g. /administrator/add-category

  // 1. Allow public routes
  if (publicRoutes.includes(pathname)) {
    if (token) {
      try {
        const decoded = await verifyToken(token);
        return NextResponse.redirect(new URL(`/${decoded.role}`, request.url));
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // 2. Redirect to login if no token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Verify token
  try {
    const decoded = await verifyToken(token);

    // 4. Redirect generic dashboard to role-specific page
    if (pathname === '/dashboard') {
      return NextResponse.redirect(new URL(`/${decoded.role}`, request.url));
    }

    // 5. Role-based route access
    if (
      adminOnlyRoutes.some(route => pathname.startsWith(route)) &&
      decoded.role !== 'admin'
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (
      administratorOnlyRoutes.some(route => pathname.startsWith(route)) &&
      decoded.role !== 'administrator'
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // 6. Allow access
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

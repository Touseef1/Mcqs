// import { NextResponse } from 'next/server';
// import { AuthResponse } from '@/types';

// export async function POST() {
//   const response = NextResponse.json<AuthResponse>(
//     { success: true, message: 'Logged out successfully' },
//     { status: 200 }
//   );


  
//   response.cookies.delete('token');

//   return response;

// }


import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));

  // Delete the token cookie
  response.cookies.delete('token');

  return response;
}

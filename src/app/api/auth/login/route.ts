import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { AuthResponse } from '@/types';

export async function POST(request: Request) {
  await dbConnect();
  
  const { email, password } = await request.json();
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const token = generateToken(user);
    const response = NextResponse.json<AuthResponse>(
      { 
        success: true, 
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        },
        token 
      },
      { status: 200 }
    );
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400, // 1 day
      sameSite: 'strict',
      path: '/',
    });
    
    return response;
  } catch (error) {
    return NextResponse.json<AuthResponse>(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
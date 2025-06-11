import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'; // ✅ use this
import User, { IUser } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;

export function generateToken(user: IUser): string {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}

export async function verifyToken(token: string): Promise<any> {
  return jwt.verify(token, JWT_SECRET);
}

export async function getCurrentUser(): Promise<IUser | null> {
  const cookieStore = cookies(); // ✅ fetch cookies from headers
  const token = (await cookieStore).get('token')?.value;

  if (!token) return null;

  try {
    const decoded = await verifyToken(token);
    const user = await User.findById(decoded.id).lean();
    return user;
  } catch (error) {
    return null;
  }
}


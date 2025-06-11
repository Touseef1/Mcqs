// app/admin/users/actions.ts
'use server';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';

export async function updateUserRole(userId: string, newRole: 'user' | 'admin' | 'administrator') {
  await dbConnect();

  const currentUser = await getCurrentUser();

  // Prevent modifying the current admin's role
  if (userId === currentUser?._id.toString()) {
    throw new Error('Cannot modify your own role');
  }

  await User.findByIdAndUpdate(userId, { role: newRole });
  revalidatePath('/administrator/users');
}

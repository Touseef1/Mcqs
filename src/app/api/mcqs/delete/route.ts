import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Mcq from '@/models/Mcq';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  await dbConnect();
  const user = await getCurrentUser(req as any);

  if (!user || user.role !== 'administrator') {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json(
      { success: false, message: 'MCQ ID is required' },
      { status: 400 }
    );
  }

  try {
    await Mcq.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete MCQ' },
      { status: 500 }
    );
  }
}
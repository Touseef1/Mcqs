import dbConnect from '@/lib/db';
import Mcq from '@/models/Mcq';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  await dbConnect();
  const user = await getCurrentUser(req as any);

  if (!user || user.role !== 'administrator') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, status, ...updateData } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  try {
    // If status is provided, update just status
    if (status) {
      await Mcq.findByIdAndUpdate(id, { status });
    } 
    // Otherwise update all provided fields
    else if (Object.keys(updateData).length > 0) {
      await Mcq.findByIdAndUpdate(id, updateData);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update MCQ' },
      { status: 500 }
    );
  }
}
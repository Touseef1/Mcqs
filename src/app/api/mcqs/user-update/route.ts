import dbConnect from '@/lib/db';
import Mcq from '@/models/Mcq';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
  await dbConnect();
  const user = await getCurrentUser(req as any);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, ...updateData } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'MCQ ID is required' }, { status: 400 });
  }

  try {
    // Verify the MCQ exists and belongs to the user
    const mcq = await Mcq.findOne({ _id: id, createdBy: user._id, status: 'pending' });
    
    if (!mcq) {
      return NextResponse.json(
        { success: false, message: 'MCQ not found or not eligible for update' },
        { status: 404 }
      );
    }

    // Update only the allowed fields (not status)
    const { status, ...validUpdates } = updateData;
    await Mcq.findByIdAndUpdate(id, validUpdates);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update MCQ' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Paper from '@/models/Paper';
import Mcq from '@/models/Mcq';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { paperId: string } }
) {
  await dbConnect();
  const user = await getCurrentUser(request as any);
  
  if (!user || user.role !== 'admin') {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const paper = await Paper.findById(params.paperId);
    if (!paper) {
      return NextResponse.json(
        { success: false, message: 'Paper not found' },
        { status: 404 }
      );
    }

    const data = await request.json();
    const mcq = new Mcq({
      ...data,
      paper: paper._id,
      // category: paper.category,
      createdBy: user._id
    });

    await mcq.save();

    // Add MCQ to paper
    paper.mcqs.push(mcq._id);
    await paper.save();

    return NextResponse.json(
      { success: true, mcq },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to add MCQ' },
      { status: 400 }
    );
  }
}
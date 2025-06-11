import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Paper from '@/models/Paper';
import Mcq from '@/models/Mcq';
import { getCurrentUser } from '@/lib/auth';

export async function DELETE(
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
    // First delete all MCQs associated with this paper
    await Mcq.deleteMany({ paper: params.paperId });
    
    // Then delete the paper itself
    await Paper.findByIdAndDelete(params.paperId);
    
    return NextResponse.json(
      { success: true, message: 'Paper deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete paper' },
      { status: 400 }
    );
  }
}
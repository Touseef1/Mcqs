import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Mcq from '@/models/Mcq';
import { getCurrentUser } from '@/lib/auth';
import { IMcq } from '@/models/Mcq';

export async function GET(request: Request) {
  await dbConnect();
  
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'approved';
  const category = searchParams.get('category');
  
  try {
    const query: any = { status };
    if (category) query.category = category;
    
    const mcqs = await Mcq.find(query)
      .populate('category', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, mcqs });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch MCQs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  const user = await getCurrentUser(request as any);
  
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const data = await request.json();
    
    const mcq = new Mcq({
      ...data,
      createdBy: user._id,
      status: 'pending'
    });
    
    await mcq.save();
    
    return NextResponse.json(
      { success: true, mcq },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create MCQ' },
      { status: 400 }
    );
  }
}
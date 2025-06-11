import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Paper from '@/models/Paper';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  await dbConnect();
  const user = await getCurrentUser(request as any);
  
  if (!user || user.role !== 'admin') {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const { name, description } = await request.json();
    
    const paper = new Paper({
      name,
      description,
      createdBy: user._id
    });
    
    await paper.save();
    
    return NextResponse.json(
      { success: true, paper },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create paper' },
      { status: 400 }
    );
  }
}
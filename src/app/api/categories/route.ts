import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  await dbConnect();
  
  try {
    const categories = await Category.find().sort({ name: 1 });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  const user = await getCurrentUser(request as any);
  
  if (!user || user.role !== 'administrator' ) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const { name } = await request.json();
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    
    const category = new Category({ name, slug });
    await category.save();
    
    return NextResponse.json(
      { success: true, category },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create category' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  const user = await getCurrentUser(request as any);
  
  if (!user || user.role !== 'administrator' ) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Category ID is required' },
        { status: 400 }
      );
    }
    
    await Category.findByIdAndDelete(id);
    
    return NextResponse.json(
      { success: true, message: 'Category deleted' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete category' },
      { status: 400 }
    );
  }
}
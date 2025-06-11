import dbConnect from '@/lib/db';
import Mcq from '@/models/Mcq';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { id, status } = await req.json();

  if (!id || !status) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  await dbConnect();
  await Mcq.findByIdAndUpdate(id, { status });

  return NextResponse.json({ success: true });
}

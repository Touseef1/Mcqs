import McqForm from '@/components/Mcq/Form';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import { redirect } from 'next/navigation';

export default async function AddMcqPage() {
  await dbConnect();
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  const categories = await Category.find().sort({ name: 1 }).lean();
  
  const handleSubmit = async (data: any) => {
    'use server';
    
    await dbConnect();
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Unauthorized');
    }
    
    const Mcq = (await import('@/models/Mcq')).default;
    const mcq = new Mcq({
      ...data,
      createdBy: user._id,
      status: 'pending'
    });
    
    await mcq.save();
    
    return { success: true };
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add New MCQ</h1>
      <McqForm 
        categories={categories.map(cat => ({ 
          id: cat._id.toString(), 
          name: cat.name 
        }))}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
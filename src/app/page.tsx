import McqList from '@/components/Mcq/List';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Mcq from '@/models/Mcq';
import Category from '@/models/Category';
import Link from 'next/link';

export default async function Home() {
  await dbConnect();
  
  // Get approved MCQs
  const mcqs = await Mcq.find({ status: 'approved' })
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .lean();
  
  // Get all categories
  const categories = await Category.find().sort({ name: 1 }).lean();
  
  const user = await getCurrentUser();
  
  return (
    <> 
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">MCQs</h1>
        {user ? (
          <Link href="/mcqs/add" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Add MCQ
          </Link>
        ) : (
          <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Login to Add MCQ
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <McqList 
            mcqs={mcqs.map(mcq => ({
              id: mcq._id.toString(),
              statement: mcq.statement,
              options: mcq.options,
              correctOption: mcq.correctOption,
              type: mcq.type,
              category: { id: mcq.category?._id.toString(), name: mcq.category?.name },
              description: mcq.description,
              status: mcq.status
            }))} 
          />
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category._id.toString()}>
                  <Link 
                    href={`/?category=${category._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
     </>
  );
}
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Paper from '@/models/Paper';
import { redirect } from 'next/navigation';
import PaperList from "@/components/Admin/PaperList"
import Link from 'next/link';


export default async function AdminPapersPage() {
  await dbConnect();
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  const papers = await Paper.find()
    // .populate('category', 'name')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Papers</h1>
        <Link 
          href="/admin/papers/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create New Paper
        </Link>
      </div>

      {papers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No papers created yet</p>
          <Link 
            href="/admin/papers/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Your First Paper
          </Link>
        </div>
      ) : (
        <PaperList papers={papers} />
      )}
    </div>
  );
}
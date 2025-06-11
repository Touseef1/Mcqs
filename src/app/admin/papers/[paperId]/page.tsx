import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Paper from '@/models/Paper';
import Mcq from '@/models/Mcq';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import McqList from '@/components/Mcq/List';
import { deletePaper } from '@/actions/paperActions';

export default async function AdminPaperDetailPage({
  params,
}: {
  params: { paperId: string };
}) {
  await dbConnect();
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  const paper = await Paper.findById(params.paperId)
    // .populate('category', 'name')
    .populate('createdBy', 'name')
    .lean();

  const mcqs = await Mcq.find({ paper: params.paperId })
    // .populate('category', 'name')
    .sort({ createdAt: -1 })
    .lean();

  if (!paper) {
    redirect('/admin/papers');
  }

  const handleDelete = async () => {
    'use server';
    await deletePaper(params.paperId);
    redirect('/admin/papers');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{paper.name}</h1>
          <p className="text-gray-600 mt-2">{paper.description}</p>
          <div className="flex items-center mt-4 text-sm text-gray-500">
            {/* <span>Category: {paper.category.name}</span> */}
            <span className="mx-2">•</span>
            <span>{mcqs.length} MCQs</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/papers/${params.paperId}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Paper
          </Link>
          <form action={handleDelete}>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete Paper
            </button>
          </form>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">MCQs in this Paper</h2>
          <Link
            href={`/admin/papers/${params.paperId}/add-mcqs`}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add More MCQs
          </Link>
        </div>
        <McqList mcqs={mcqs} />
      </div>

      <div className="flex justify-end">
        <Link
          href="/admin/papers"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back to Papers
        </Link>
      </div>
    </div>
  );
}
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Paper from '@/models/Paper';
import Mcq from '@/models/Mcq';
import { redirect } from 'next/navigation';
import McqList from '@/components/Mcq/List';

export default async function PaperDetailPage({
  params,
}: {
  params: { paperId: string };
}) {
  await dbConnect();
  const user = await getCurrentUser();

  const paper = await Paper.findById(params.paperId)
    .populate('category', 'name')
    .populate('createdBy', 'name')
    .lean();

  const mcqs = await Mcq.find({ paper: params.paperId })
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .lean();

  if (!paper) {
    redirect('/papers');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{paper.name}</h1>
        <p className="text-gray-600 mt-2">{paper.description}</p>
        <div className="flex items-center mt-4 text-sm text-gray-500">
          <span>Category: {paper.category.name}</span>
          <span className="mx-2">•</span>
          <span>{mcqs.length} MCQs</span>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">MCQs in this Paper</h2>
      <McqList mcqs={mcqs} />
    </div>
  );
}
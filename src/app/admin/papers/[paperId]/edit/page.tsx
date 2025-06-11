import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Paper from '@/models/Paper';
import { redirect } from 'next/navigation';
import PaperForm from '@/components/Admin/PaperForm';
import { updatePaper } from '@/actions/paperActions';

export default async function EditPaperPage({
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
    // .populate('category', '_id name')
    .lean();

  if (!paper) {
    redirect('/admin/papers');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Paper: {paper.name}</h1>
      
      <PaperForm 
        initialData={{
          name: paper.name,
          description: paper.description || '',
          // category: paper.category._id.toString()
        }}
        onSubmit={async (data) => {
          'use server';
          await updatePaper(params.paperId, {
            name: data.name,
            description: data.description,
            // category: data.category
          });
          redirect(`/admin/papers/${params.paperId}`);
        }}
      />
    </div>
  );
}
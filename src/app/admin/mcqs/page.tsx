import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Mcq from '@/models/Mcq';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

type McqLean = {
  _id: string;
  statement: string;
  options: string[];
  correctOption: number;
  category: { name: string };
  createdBy: { name: string; email: string }; 
  description?: string;
  type: string;
  createdAt: Date;
};

export default async function AdminMcqsPage() {
  await dbConnect();
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    redirect('/');
  }

  const mcqs = await Mcq.find({ status: 'pending' })
    .populate('category', 'name')
    .populate('createdBy', 'name email') 
    .sort({ createdAt: -1 })
    .lean<McqLean[]>();

  async function handleApprove(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await dbConnect();
    await Mcq.findByIdAndUpdate(id, { status: 'approved' });
    revalidatePath('/admin/mcqs');
  }

  async function handleReject(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await dbConnect();
    await Mcq.findByIdAndUpdate(id, { status: 'rejected' });
    revalidatePath('/admin/mcqs');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Pending MCQs for Approval</h1>

      {mcqs.length === 0 ? (
        <p className="text-gray-500">No pending MCQs to review.</p>
      ) : (
        <div className="space-y-4">
          {mcqs.map((mcq) => (
            <div key={mcq._id.toString()} className="border p-4 rounded shadow">
              <div className="mb-4">
                <p className="font-semibold text-lg">{mcq.statement}</p>
                <p className="text-sm text-gray-600">
                  Submitted by: {mcq.createdBy.name} ({mcq.createdBy.email})
                </p>
               
                <p className="text-sm text-gray-600">
                  Submitted on: {new Date(mcq.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Options:</h4>
                <ul className="list-disc list-inside pl-4">
                  {mcq.options.map((opt: string, idx: number) => (
                    <li 
                      key={idx} 
                      className={idx === mcq.correctOption ? 'text-green-600 font-medium' : ''}
                    >
                      {opt} {idx === mcq.correctOption && '(Correct Answer)'}
                    </li>
                  ))}
                </ul>
              </div>

              {mcq.description && (
                <div className="mb-4">
                  <h4 className="font-medium mb-1">Description:</h4>
                  <p className="text-gray-700">{mcq.description}</p>
                </div>
              )}

              <div className="mt-4 flex gap-4">
                <form action={handleApprove}>
                  <input type="hidden" name="id" value={mcq._id.toString()} />
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                </form>
                <form action={handleReject}>
                  <input type="hidden" name="id" value={mcq._id.toString()} />
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
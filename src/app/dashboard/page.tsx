import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Mcq from '@/models/Mcq';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function UserDashboard() {
  await dbConnect();
  const user = await getCurrentUser();

  if (!user) redirect('/login');
  if (user.role !== 'user') redirect(`/${user.role}`);

  const myMcqs = await Mcq.find({ createdBy: user._id })
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium text-lg mb-2">Your MCQs</h3>
          <p className="text-3xl font-bold">{myMcqs.length}</p>
          <Link href="/mcqs/add" className="text-blue-600 hover:underline mt-2 inline-block">
            Add New MCQ
          </Link>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Recent Submissions</h2>
      {/* Display user's MCQs with status */}
    </div>
  );
}
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Mcq from '@/models/Mcq';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  await dbConnect();
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') redirect('/');

  const pendingMcqs = await Mcq.countDocuments({ status: 'pending' });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium text-lg mb-2">Pending MCQs</h3>
          <p className="text-3xl font-bold">{pendingMcqs}</p>
          <Link href="/admin/mcqs" className="text-blue-600 hover:underline mt-2 inline-block">
            Review MCQs
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/mcqs" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Review MCQs
          </Link>
        </div>
      </div>
    </div>
  );
}
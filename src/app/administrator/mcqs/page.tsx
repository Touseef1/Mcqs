import AdminMcqsClient from './AdminMcqsClient';
import dbConnect from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Mcq from '@/models/Mcq';


export default async function AdminMcqsPage() {
  await dbConnect();
  const user = await getCurrentUser();

  if (!user || user.role !== 'administrator') {
    redirect('/');
  }

//   const mcqs = await Mcq.find({})
//     .populate('category', 'name')
//     .populate('createdBy', 'name email')
//     .sort({ createdAt: -1 })
//     .lean();

  const mcqsRaw = await Mcq.find({})
    .populate('category', 'name')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .lean();
const mcqs = mcqsRaw.map((mcq: any) => ({
  ...mcq,
  _id: mcq._id.toString(),
  createdAt: mcq.createdAt?.toISOString(),
  category: mcq.category
    ? {
        ...mcq.category,
        _id: mcq.category._id?.toString(),
      }
    : null,
  createdBy: mcq.createdBy
    ? {
        ...mcq.createdBy,
        _id: mcq.createdBy._id?.toString(),
      }
    : null,
}));



  return <AdminMcqsClient mcqs={mcqs} />;
}

// app/mcqs/page.tsx
import dbConnect from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import Mcq from '@/models/Mcq';
import Category from '@/models/Category';
import McqsClientComponent from '@/components/Mcq/McqsComponent';

export default async function McqsPage() {
  await dbConnect();
  
  // Get approved MCQs
  const mcqs = await Mcq.find({ status: 'approved' })
    .populate('category', 'name')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .lean();
  
  // Get all categories
  const categories = await Category.find().sort({ name: 1 }).lean();
  

  // Convert to plain objects for serialization
  const serializedMcqs = mcqs.map(mcq => ({
    ...mcq,
    _id: mcq._id.toString(),
    category: mcq.category ? {
      ...mcq.category,
      _id: mcq.category._id.toString()
    } : null,
    createdAt: mcq.createdAt?.toISOString(),
    updatedAt: mcq.updatedAt?.toISOString(),
    createdBy: mcq.createdBy ? {
      ...mcq.createdBy,
      _id: mcq.createdBy._id.toString(),
    }:null,
  }));  

  const serializedCategories = categories.map(category => ({
    ...category,
    _id: category._id.toString()
  }));


  return (
    <McqsClientComponent 
      mcqs={serializedMcqs} 
      categories={serializedCategories} 
    />
  );
}
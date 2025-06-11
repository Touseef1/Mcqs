import dbConnect from '@/lib/db';
import Mcq from '@/models/Mcq';
import Paper from '@/models/Paper';
import PaperComponent from '@/components/Paper/PaperComponent';

export default async function McqsPage() {
  await dbConnect();

  const papers = await Paper.find()
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 })
    .lean();
  
  // Get approved MCQs
  const mcqs = await Mcq.find({ status: 'approved' })
    .populate('createdBy', 'name')
    .populate('paper', 'name')
    .sort({ createdAt: -1 })
    .lean();

  // Convert to plain objects for serialization
  const serializedMcqs = mcqs.map(mcq => ({
    ...mcq,
    _id: mcq._id.toString(),
    paper: mcq.paper ? {
      ...mcq.paper,
      _id: mcq.paper._id.toString(),
      name: mcq.paper.name
    } : null,
    createdAt: mcq.createdAt?.toISOString(),
    updatedAt: mcq.updatedAt?.toISOString(),
    createdBy: mcq.createdBy ? {
      ...mcq.createdBy,
      _id: mcq.createdBy._id.toString(),
    } : null,
  }));  

  const serializedPapers = papers.map(paper => ({
    ...paper,
    _id: paper._id.toString(),
    createdBy: paper.createdBy ? {
      ...paper.createdBy,
      _id: paper.createdBy._id.toString(),
    } : null,
  }));

  return (
    <PaperComponent 
      mcqs={serializedMcqs} 
      papers={serializedPapers} 
    />
  );
}
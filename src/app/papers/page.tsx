import dbConnect from '@/lib/db';
import Mcq from '@/models/Mcq';
import Paper from '@/models/Paper';
import McqsClientComponent from '@/components/Paper/PaperComponent';

// Define the types matching the PaperComponent's expected props
interface MCQ {
  _id: string;
  statement: string;
  options: string[];
  correctOption: number;
  paper?: {
    _id: string;
    name: string;
  } | null;
  type?: string;
  createdBy?: {
    name?: string;
  } | null;
  description?: string;
}

interface PaperType {
  _id: string;
  name: string;
}

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

  // Convert to plain objects for serialization and match MCQ type
  const serializedMcqs: MCQ[] = mcqs.map((mcq: typeof mcqs[0] extends undefined ? unknown : typeof mcqs[0]) => ({
    _id: mcq._id.toString(),
    statement: mcq.statement,
    options: mcq.options,
    correctOption: mcq.correctOption,
    paper: mcq.paper
      ? {
          _id: mcq.paper._id.toString(),
          name: mcq.paper.name,
        }
      : null,
    type: mcq.type,
    createdBy: mcq.createdBy
      ? {
          name: mcq.createdBy.name,
        }
      : null,
    description: mcq.description,
  }));

  // Convert to plain objects for serialization and match Paper type
  const serializedPapers: PaperType[] = papers.map((paper: typeof papers[0] extends undefined ? unknown : typeof papers[0]) => ({
    // _id: paper?_id: (paper._id as O_id: (paper._id as ObjectId).toString(),bjectId).toString(),._id.toString(),
    _id: (paper._id as string).toString(),
    name: paper.name,
  }));

  return (
    <McqsClientComponent 
      mcqs={serializedMcqs} 
      papers={serializedPapers} 
    />
  );
}
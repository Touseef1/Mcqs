import Link from 'next/link';

export default function PaperList({ papers }: { papers: any[] }) {
  return (
    <div className="space-y-4">
      {papers.map(paper => (
        <div key={paper._id} className="border p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{paper.name}</h3>
              <p className="text-gray-600">{paper.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                {paper.mcqs.length} MCQs • {paper.category.name}
              </p>
            </div>
            <Link 
              href={`/papers/${paper._id}`}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
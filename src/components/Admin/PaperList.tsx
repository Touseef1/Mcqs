// import Link from 'next/link';

// interface Paper {
//   _id: string;
//   name: string;
//   description?: string;
//   category: { name: string };
//   createdBy: { name: string };
//   mcqs: string[];
//   createdAt: Date;
// }

// export default function PaperList({ papers }: { papers: Paper[] }) {
//   return (
//     <div className="bg-white shadow rounded-lg overflow-hidden">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MCQs</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {papers.map((paper) => (
//             <tr key={paper._id}>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <div className="font-medium text-gray-900">{paper.name}</div>
//                 {paper.description && (
//                   <div className="text-sm text-gray-500">{paper.description}</div>
//                 )}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 {paper.category?.name}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 {paper.mcqs.length}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 {paper.createdBy.name}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                 <div className="flex space-x-2">
//                   <Link
//                     href={`/admin/papers/${paper._id}`}
//                     className="text-blue-600 hover:text-blue-900"
//                   >
//                     View
//                   </Link>
//                   <Link
//                     href={`/admin/papers/${paper._id}/edit`}
//                     className="text-indigo-600 hover:text-indigo-900"
//                   >
//                     Edit
//                   </Link>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


import Link from 'next/link';


interface Paper {
  _id: string;
  name: string;
  description?: string;
  category: { name: string };
  createdBy: { name: string };
  mcqs: string[];
  createdAt: Date;
}

export default function PaperList({ papers }: { papers: Paper[] }) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th> */}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MCQs</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {papers.map((paper) => (
            <tr key={paper._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{paper.name}</div>
                {paper.description && (
                  <div className="text-sm text-gray-500">{paper.description}</div>
                )}
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {paper.category?.name}
              </td> */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {paper.mcqs?.length}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {paper.createdBy?.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Link
                    href={`/admin/papers/${paper._id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/papers/${paper._id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import axios from 'axios';
// import McqForm from '@/components/Mcq/Form';


// export default function AddMcqsPage() {
//   const { paperId } = useParams();
//   const router = useRouter();
//   const [success, setSuccess] = useState(false);
//   const [categories, setCategories] = useState([]);


//   useEffect(() => {
//     getCategories();
//   }, []); // Empty dependency array ensures it runs only once
  
  
//   const getCategories = async () => {
//     try {
//       const response = await axios.get('/api/categories'); 
//       console.log(response.data,"categories")// <-- recommended: use API route
//       setCategories(response.data.categories); // Set state
//     } catch (error) {
//       console.error('Failed to fetch categories', error);
//     }
//   };

//   const handleSubmit = async (data: any) => {
//     try {
//       await axios.post(`/api/admin/papers/${paperId}/mcqs`, data);
//       setSuccess(true);
//       // Reset form or keep it for adding more
//     } catch (error) {
//       console.error('Error adding MCQ:', error);
//     }
//   };

//   const handleFinish = () => {
//     router.push(`/admin/papers/${paperId}`);
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Add MCQs to Paper</h1>
      
//       {success && (
//         <div className="p-4 mb-6 bg-green-100 text-green-800 rounded-lg">
//           MCQ added successfully! You can add another or finish.
//         </div>
//       )}

//       <McqForm 
//         onSubmit={handleSubmit}
//          categories={categories.map(cat => ({ 
//           id: cat._id.toString(), 
//           name: cat.name 
//         }))}
//         showPaperField={false}
//       />

//       <div className="mt-6 flex justify-end">
//         <button
//           onClick={handleFinish}
//           className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//         >
//           Finish and View Paper
//         </button>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import McqForm from '@/components/Mcq/Form';
import { McqFormData } from '@/types';


// Category type from the backend
interface Category {
  id: string;
  _id?: string;
  name: string;
}

// MCQ form data shape

export default function AddMcqsPage() {
  const params = useParams();
  const paperId = Array.isArray(params?.paperId) ? params.paperId[0] : params?.paperId;
  const router = useRouter();

  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      const formatted = response.data.categories.map((cat: Category) => ({
        id: cat._id?.toString(),
        name: cat.name,
      }));
      setCategories(formatted);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const handleSubmit = async (data: McqFormData) => {
    try {
      await axios.post(`/api/admin/papers/${paperId}/mcqs`, data);
      setSuccess(true);
    } catch (error) {
      console.error('Error adding MCQ:', error);
    }
  };

  const handleFinish = () => {
    router.push(`/admin/papers/${paperId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add MCQs to Paper</h1>

      {success && (
        <div className="p-4 mb-6 bg-green-100 text-green-800 rounded-lg">
          MCQ added successfully! You can add another or finish.
        </div>
      )}

      <McqForm
        onSubmit={handleSubmit}
        categories={categories}
        showPaperField={false}
      />

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleFinish}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Finish and View Paper
        </button>
      </div>
    </div>
  );
}

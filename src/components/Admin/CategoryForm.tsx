// 'use client';

// import { useState } from 'react';
// import axios from 'axios';
// import Input from '@/components/UI/McqsInput';
// import Button from '@/components/UI//McqsButton';

// export default function CategoryForm() {
//   const [name, setName] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       const response = await axios.post('/api/categories', { name });
//       if (response.data.success) {
//         setSuccess('Category added successfully!');
//         setName('');
//         // You might want to refresh the category list here
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to add category');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       {error && (
//         <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
//           {error}
//         </div>
//       )}
      
//       {success && (
//         <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
//           {success}
//         </div>
//       )}
      
//       <Input
//         label="Category Name"
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         required
//       />
      
//       <Button type="submit" variant="primary" isLoading={isLoading}>
//         Add Category
//       </Button>
//     </form>
//   );
// }


'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Input from '@/components/UI/McqsInput';
import Button from '@/components/UI/McqsButton';

export default function CategoryForm() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('/api/categories', { name });
      if (response.data.success) {
        toast.success('Category added successfully!');
        setName('');
        router.refresh(); // Refresh the server component
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label="Category Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      
      <Button 
        type="submit" 
        variant="primary" 
        isLoading={isLoading}
        className="w-full justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isLoading ? 'Adding...' : 'Add Category'}
      </Button>
    </form>
  );
}
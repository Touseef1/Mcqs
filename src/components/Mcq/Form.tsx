// 'use client';

// import React, { useState, useEffect } from 'react';
// import Input from '@/components/UI/McqsInput';
// import Button from '@/components/UI/McqsButton';
// import Select from '@/components/UI/McqsSelect';
// import { McqFormData } from '@/types';

// interface McqFormProps {
//   categories: { id: string; name: string }[];
//   initialData?: McqFormData;
//   onSubmit: (data: McqFormData) => Promise<void>;
// }

// const McqForm: React.FC<McqFormProps> = ({ categories, initialData, onSubmit }) => {
//   const [formData, setFormData] = useState<McqFormData>({
//     statement: '',
//     options: ['', '', '', ''],
//     correctOption: 0,
//     type: 'medium',
//     category: categories.length > 0 ? categories[0].id : '',
//     description: ''
//   });
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (initialData) {
//       setFormData(initialData);
//     }
//   }, [initialData]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleOptionChange = (index: number, value: string) => {
//     const newOptions = [...formData.options];
//     newOptions[index] = value;
//     setFormData(prev => ({ ...prev, options: newOptions }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     try {
//       await onSubmit(formData);
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Failed to save MCQ');
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
      
//       <Input
//         label="Question Statement"
//         type="text"
//         name="statement"
//         value={formData.statement}
//         onChange={handleChange}
//         required
//       />
      
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700">Options</label>
//         {[0, 1, 2, 3].map((index) => (
//           <div key={index} className="flex items-center">
//             <input
//               type="radio"
//               name="correctOption"
//               checked={formData.correctOption === index}
//               onChange={() => setFormData(prev => ({ ...prev, correctOption: index }))}
//               className="mr-2"
//             />
//             <Input
//               type="text"
//               value={formData.options[index]}
//               onChange={(e) => handleOptionChange(index, e.target.value)}
//               required
//               className="flex-1"
//             />
//           </div>
//         ))}
//       </div>
      
//       <Select
//         label="Difficulty Level"
//         name="type"
//         value={formData.type}
//         onChange={handleChange}
//         options={[
//           { value: 'easy', label: 'Easy' },
//           { value: 'medium', label: 'Medium' },
//           { value: 'hard', label: 'Hard' }
//         ]}
//       />
      
//       <Select
//         label="Category"
//         name="category"
//         value={formData.category}
//         onChange={handleChange}
//         options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
//         required
//       />
      
//       <Input
//         label="Description (Optional)"
//         type="textarea"
//         name="description"
//         value={formData.description || ''}
//         onChange={handleChange}
//         as="textarea"
//         rows={3}
//       />
      
//       <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
//         Submit MCQ
//       </Button>
//     </form>
//   );
// };

// export default McqForm;




'use client';

import React, { useState, useEffect } from 'react';
import Input from '@/components/UI/McqsInput';
import Button from '@/components/UI/McqsButton';
import Select from '@/components/UI/McqsSelect';
import { McqFormData } from '@/types';
import { toast } from 'react-toastify';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';



interface McqFormProps {
  categories: { id: string; name: string }[];
  initialData?: McqFormData;
  onSubmit: (data: McqFormData) => Promise<void>;
}

const McqForm: React.FC<McqFormProps> = ({ categories, initialData, onSubmit }) => {
  const [formData, setFormData] = useState<McqFormData>({
    statement: '',
    options: ['', '', '', ''],
    correctOption: 0,
    type: 'medium',
    category: categories?.length > 0 ? categories[0]?.id : '',
    description: ''
  });


  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save MCQ');
      toast.success(err.response?.data?.message || 'Failed to save MCQ');
    } finally {
      setIsLoading(false);
      toast.success('MCQ saved successfully');
      formData.statement = '';
      formData.options = ['', '', '', ''];
      formData.correctOption = 0;
      formData.type = 'medium';
      formData.category = categories.length > 0 ? categories[0].id : '';
      formData.description = '';
    }
  };



  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      {/* <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New MCQ</h2> */}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <Input
            label="Question Statement"
            type="text"
            name="statement"
            value={formData.statement}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
        
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
          <div className="grid grid-cols-1 gap-4">
            {[0, 1, 2, 3].map((index) => (
              <div 
                key={index} 
                className={`flex items-center p-3 border rounded-lg transition-all ${formData.correctOption === index ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                onClick={() => setFormData(prev => ({ ...prev, correctOption: index }))}
              >
                <div className="flex items-center h-5 mr-3">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={formData.correctOption === index}
                    onChange={() => {}}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <Input
                  type="text"
                  value={formData.options[index]}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                  className="flex-1 border-none bg-transparent focus:ring-0 px-0"
                  placeholder={`Option ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Difficulty Level"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={[
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Medium' },
              { value: 'hard', label: 'Hard' }
            ]}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          
          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categories?.map(cat => ({ value: cat.id, label: cat.name }))}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
        
        {/* <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Add any additional context or explanation..."
          />
        </div>
         */}
<div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Description (Optional)
        </label>
        <CKEditor
          editor={ClassicEditor}
          data={formData.description}
          onChange={(_, editor) => {
            const data = editor.getData();
            setFormData(prev => ({ ...prev, description: data }));
          }}
        />
      </div>

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-150 ease-in-out"
          isLoading={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save MCQ'}
        </Button>
      </form>
    </div>
  );
};

export default McqForm;
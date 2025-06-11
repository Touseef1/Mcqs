'use client';

import { useState } from 'react';
import Input from '../UI/McqsInput';
import Select from '../UI/McqsSelect';
import Button from '../UI/McqsButton';

export default function PaperForm({ 
  onSubmit,
  initialData
}: {
  onSubmit: (data: any) => void;
  initialData?: any;
}) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    // category: '6847f248a55340726a623063'
  });
// const [categories, setCategories] = useState([
//   { _id: '683ffda41eb68c8580a65d4a', name: 'Category 1' },
//   { _id: '683ffdb01eb68c8580a65d50', name: 'Category 2' },
//   { _id: '683ffdbd1eb68c8580a65d53', name: 'Category 3' }
// ]);

  const [isLoading, setIsLoading] = useState(false);

 

  // Fetch categories (you can implement this)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onSubmit(formData);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <Input
        label="Paper Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      
      <Input
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        as="textarea"
        rows={3}
      />
      
      {/* <Select
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        options={categories.map(cat => ({ value: cat._id, label: cat.name }))}
        required
      /> */}
      
      <Button type="submit" variant="primary" isLoading={isLoading}>
        {/* Create Paper */}
          {initialData ? 'Update Paper' : 'Create Paper'}

      </Button>
    </form>
  );
}



// 'use client';

// import { useState, useEffect } from 'react';
// import Input from '../UI/McqsInput';
// import Select from '../UI/McqsSelect';
// import Button from '../UI/McqsButton';


// export default function PaperForm({ 
//   initialData,
//   action,
//   categories = []
// }: {
//   initialData?: any;
//   action: (formData: FormData) => Promise<void>;
//   categories?: any[];
// }) {
//   const [formData, setFormData] = useState(initialData || {
//     name: '',
//     description: '',
//     category: ''
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const [categoriess, setCategoriess] = useState([
//   { _id: '683ffda41eb68c8580a65d4a', name: 'Category 1' },
//   { _id: '683ffdb01eb68c8580a65d50', name: 'Category 2' },
//   { _id: '683ffdbd1eb68c8580a65d53', name: 'Category 3' }
// ]);

//   useEffect(() => {
//     if (initialData) {
//       setFormData(initialData);
//     }
//   }, [initialData]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   return (
//     <form action={action} className="space-y-4 max-w-lg">
//       <Input
//         label="Paper Name"
//         name="name"
//         value={formData.name}
//         onChange={handleChange}
//         required
//       />
      
//       <Input
//         label="Description"
//         name="description"
//         value={formData.description}
//         onChange={handleChange}
//         as="textarea"
//         rows={3}
//       />
      
//       <Select
//         label="Category"
//         name="category"
//         value={formData.category}
//         onChange={handleChange}
//         options={categoriess.map(cat => ({ value: cat._id, label: cat.name }))}
//         required
//       />
      
//       <Button type="submit" variant="primary" isLoading={isLoading}>
//         {initialData ? 'Update Paper' : 'Create Paper'}
//       </Button>
//     </form>
//   );
// }
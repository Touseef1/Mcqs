'use client';

import { use, useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import PaperForm from '@/components/Admin/PaperForm';
import McqForm from '@/components/Mcq/Form';



export default function NewPaperPage() {
  const [step, setStep] = useState<'paper' | 'mcq'>('paper');
  const [paperId, setPaperId] = useState<string | null>(null);
  const [paperData, setPaperData] = useState({
    name: '',
    description: '',
    // category: ''
  });
  const router = useRouter();
  const [categories, setCategories] = useState([]);


useEffect(() => {
  getCategories();
}, []); // Empty dependency array ensures it runs only once


const getCategories = async () => {
  try {
    const response = await axios.get('/api/categories'); 
    console.log(response.data,"categories")// <-- recommended: use API route
    setCategories(response.data.categories); // Set state
  } catch (error) {
    console.error('Failed to fetch categories', error);
  }
};


  const handlePaperSubmit = async (data: any) => {
    try {
      const response = await axios.post('/api/admin/papers', data);
      setPaperId(response.data.paper._id);
      setPaperData(data);
      setStep('mcq');
    } catch (error) {
      console.error('Error creating paper:', error);
    }
  };

  const handleMcqSubmit = async (data: any) => {
    try {
      await axios.post(`/api/admin/papers/${paperId}/mcqs`, data);
      // Reset form for next MCQ
    } catch (error) {
      console.error('Error adding MCQ:', error);
    }
  };

  const handleFinish = () => {
    router.push(`/admin/papers/${paperId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Paper</h1>
      
      <div className="mb-6">
        <div className="flex items-center">
          <div className={`flex items-center ${step === 'paper' ? 'text-blue-600' : 'text-gray-500'}`}>
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step === 'paper' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              1
            </div>
            <span className="ml-2">Paper Details</span>
          </div>
          
          <div className="flex-1 border-t-2 border-gray-200 mx-4"></div>
          
          <div className={`flex items-center ${step === 'mcq' ? 'text-blue-600' : 'text-gray-500'}`}>
            <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step === 'mcq' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              2
            </div>
            <span className="ml-2">Add MCQs</span>
          </div>
        </div>
      </div>

      {step === 'paper' ? (
        <PaperForm onSubmit={handlePaperSubmit} />
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Add MCQs to {paperData.name}</h2>
          <McqForm 
            onSubmit={handleMcqSubmit} 
            // category={paperData.category}
            categories={categories.map(cat => ({ 
             id: cat._id.toString(), 
              name: cat.name 
            }))}
            showPaperField={false}
          />
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={handleFinish}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Finish Paper
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
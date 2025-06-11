'use client';

import { useState } from 'react';
import axios from 'axios';
import Input from '@/components/UI/McqsInput';
import Button from '@/components/UI//McqsButton';

export default function CategoryForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/categories', { name });
      if (response.data.success) {
        setSuccess('Category added successfully!');
        setName('');
        // You might want to refresh the category list here
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
          {success}
        </div>
      )}
      
      <Input
        label="Category Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      
      <Button type="submit" variant="primary" isLoading={isLoading}>
        Add Category
      </Button>
    </form>
  );
}
"use client";
import React from 'react';
import axios from 'axios';
import { Category } from '@/types';
import { useState } from 'react';

interface CategoryListProps {
  categories: Category[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError('');
    
    try {
      await axios.delete(`/api/categories?id=${id}`);
      // You might want to refresh the category list here
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories found.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {categories.map((category) => (
            <li key={category.id} className="py-3 flex justify-between items-center">
              <span>{category.name} ({category.slug})</span>
              <button
                onClick={() => handleDelete(category.id)}
                disabled={deletingId === category.id}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {deletingId === category.id ? 'Deleting...' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryList;
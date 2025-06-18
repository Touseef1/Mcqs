'use client';
import React from 'react';
import axios from 'axios';
import { Category } from '@/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/UI/ConfirmDialogCategoryDelete';
import { toast } from 'react-toastify';

interface CategoryListProps {
  categories: Category[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const router = useRouter();

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;
    
    setDeletingId(selectedCategory.id);
    setDialogOpen(false);
    
    try {
      await axios.delete(`/api/categories?id=${selectedCategory.id}`);
      toast.success('Category deleted successfully');
      router.refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete category');

    } finally {
      setDeletingId(null);
      setSelectedCategory(null);
    }
  };

  return (
    <div className="space-y-4">
     

      <ConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        description={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deletingId === selectedCategory?.id}
      />

      {categories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No categories found. Add one to get started!</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {categories.map((category) => (
            <li key={category.id} className="py-4 flex justify-between items-center">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({category.slug})</span>
              </div>
              <button
                onClick={() => handleDeleteClick(category)}
                disabled={deletingId === category.id}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === category.id ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting
                  </>
                ) : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryList;
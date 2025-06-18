import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import { redirect } from 'next/navigation';
import CategoryForm from '@/components/Admin/CategoryForm';
import CategoryList from '@/components/Admin/CategoryList';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default async function AdminCategoriesPage() {
  await dbConnect();
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'administrator') {
    redirect('/');
  }
  
  const categories = await Category.find().sort({ name: 1 }).lean();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-6 flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                  <li>
                    <div>
                      <Link href="/administrator" className="text-gray-400 hover:text-gray-500">
                        <Home className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                        <span className="sr-only">Home</span>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                      <Link
                        href="/administrator"
                        className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                      >
                        Dashboard
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                      <span className="ml-4 text-sm font-medium text-gray-500" aria-current="page">
                        Categories Management
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Category Management</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Organize your content with categories
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded">Add New</span>
            </h2>
            <CategoryForm />
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                Existing Categories ({categories.length})
              </span>
            </h2>
            <CategoryList categories={categories.map(cat => ({
              id: cat._id.toString(),
              name: cat.name,
              slug: cat.slug
            }))} />
          </div>
        </div>
      </div>
    </div>
  );
}
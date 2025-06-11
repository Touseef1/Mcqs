import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import { redirect } from 'next/navigation';
import CategoryForm from '@/components/Admin/CategoryForm';
import CategoryList from '@/components/Admin/CategoryList';

export default async function AdminCategoriesPage() {
  await dbConnect();
  const user = await getCurrentUser();
  
  // Redirect if not admin
  if (!user || user.role !== 'administrator') {
    redirect('/');
  }
  
  const categories = await Category.find().sort({ name: 1 }).lean();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
          <CategoryForm />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
          <CategoryList categories={categories.map(cat => ({
            id: cat._id.toString(),
            name: cat.name,
            slug: cat.slug
          }))} />
        </div>
      </div>
    </div>
  );
}
// import { getCurrentUser } from '@/lib/auth';
// import dbConnect from '@/lib/db';
// import Mcq from '@/models/Mcq';
// import User from '@/models/User';
// import { redirect } from 'next/navigation';
// import Link from 'next/link';

// export default async function AdminPage() {
//   await dbConnect();
//   const user = await getCurrentUser();
  
//   if (!user || user.role !== 'admin') {
//     redirect('/');
//   }
  
//   // Get stats for dashboard
//   const pendingMcqs = await Mcq.countDocuments({ status: 'pending' });
//   const totalUsers = await User.countDocuments();
//   const totalMcqs = await Mcq.countDocuments();
  
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="font-medium text-lg mb-2">Pending MCQs</h3>
//           <p className="text-3xl font-bold">{pendingMcqs}</p>
//           <Link href="/admin/mcqs" className="text-blue-600 hover:underline mt-2 inline-block">
//             Review MCQs
//           </Link>
//         </div>
        
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="font-medium text-lg mb-2">Total Users</h3>
//           <p className="text-3xl font-bold">{totalUsers}</p>
//         </div>
        
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="font-medium text-lg mb-2">Total MCQs</h3>
//           <p className="text-3xl font-bold">{totalMcqs}</p>
//           <Link href="/admin/categories" className="text-blue-600 hover:underline mt-2 inline-block">
//             Manage Categories
//           </Link>
//         </div>
//       </div>
      
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
//         <div className="flex flex-wrap gap-4">
//           <Link href="/admin/mcqs" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
//             Review MCQs
//           </Link>
//           <Link href="/admin/categories" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
//             Manage Categories
//           </Link>
//           <Link href="/admin/users" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
//             Manage Users
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }



import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Mcq from '@/models/Mcq';
import User from '@/models/User';
import Category from '@/models/Category';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdministratorDashboard() {
  await dbConnect();
  const user = await getCurrentUser();

  if (!user || user.role !== 'administrator') redirect('/');

  const [pendingMcqs, totalUsers, totalCategories] = await Promise.all([
    Mcq.countDocuments({ status: 'pending' }),
    User.countDocuments(),
    Category.countDocuments()
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Administrator Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium text-lg mb-2">Pending MCQs</h3>
          <p className="text-3xl font-bold">{pendingMcqs}</p>
          <Link href="/administrator/mcqs" className="text-blue-600 hover:underline mt-2 inline-block">
            Review MCQs
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium text-lg mb-2">Total Users</h3>
          <p className="text-3xl font-bold">{totalUsers}</p>
          <Link href="/administrator/users" className="text-blue-600 hover:underline mt-2 inline-block">
            Manage Users
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-medium text-lg mb-2">Categories</h3>
          <p className="text-3xl font-bold">{totalCategories}</p>
          <Link href="/administrator/categories" className="text-blue-600 hover:underline mt-2 inline-block">
            Manage Categories
          </Link>
        </div>
      </div>
    </div>
  );
}
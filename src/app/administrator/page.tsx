// // import { getCurrentUser } from '@/lib/auth';
// // import dbConnect from '@/lib/db';
// // import Mcq from '@/models/Mcq';
// // import User from '@/models/User';
// // import { redirect } from 'next/navigation';
// // import Link from 'next/link';

// // export default async function AdminPage() {
// //   await dbConnect();
// //   const user = await getCurrentUser();
  
// //   if (!user || user.role !== 'admin') {
// //     redirect('/');
// //   }
  
// //   // Get stats for dashboard
// //   const pendingMcqs = await Mcq.countDocuments({ status: 'pending' });
// //   const totalUsers = await User.countDocuments();
// //   const totalMcqs = await Mcq.countDocuments();
  
// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
// //         <div className="bg-white p-6 rounded-lg shadow">
// //           <h3 className="font-medium text-lg mb-2">Pending MCQs</h3>
// //           <p className="text-3xl font-bold">{pendingMcqs}</p>
// //           <Link href="/admin/mcqs" className="text-blue-600 hover:underline mt-2 inline-block">
// //             Review MCQs
// //           </Link>
// //         </div>
        
// //         <div className="bg-white p-6 rounded-lg shadow">
// //           <h3 className="font-medium text-lg mb-2">Total Users</h3>
// //           <p className="text-3xl font-bold">{totalUsers}</p>
// //         </div>
        
// //         <div className="bg-white p-6 rounded-lg shadow">
// //           <h3 className="font-medium text-lg mb-2">Total MCQs</h3>
// //           <p className="text-3xl font-bold">{totalMcqs}</p>
// //           <Link href="/admin/categories" className="text-blue-600 hover:underline mt-2 inline-block">
// //             Manage Categories
// //           </Link>
// //         </div>
// //       </div>
      
// //       <div className="bg-white p-6 rounded-lg shadow">
// //         <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
// //         <div className="flex flex-wrap gap-4">
// //           <Link href="/admin/mcqs" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
// //             Review MCQs
// //           </Link>
// //           <Link href="/admin/categories" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
// //             Manage Categories
// //           </Link>
// //           <Link href="/admin/users" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
// //             Manage Users
// //           </Link>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }



// import { getCurrentUser } from '@/lib/auth';
// import dbConnect from '@/lib/db';
// import Mcq from '@/models/Mcq';
// import User from '@/models/User';
// import Category from '@/models/Category';
// import { redirect } from 'next/navigation';
// import Link from 'next/link';

// export default async function AdministratorDashboard() {
//   await dbConnect();
//   const user = await getCurrentUser();

//   if (!user || user.role !== 'administrator') redirect('/');

//   const [pendingMcqs, totalUsers, totalCategories] = await Promise.all([
//     Mcq.countDocuments({ status: 'pending' }),
//     User.countDocuments(),
//     Category.countDocuments()
//   ]);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Administrator Dashboard</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="font-medium text-lg mb-2">Pending MCQs</h3>
//           <p className="text-3xl font-bold">{pendingMcqs}</p>
//           <Link href="/administrator/mcqs" className="text-blue-600 hover:underline mt-2 inline-block">
//             Review MCQs
//           </Link>
//         </div>
        
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="font-medium text-lg mb-2">Total Users</h3>
//           <p className="text-3xl font-bold">{totalUsers}</p>
//           <Link href="/administrator/users" className="text-blue-600 hover:underline mt-2 inline-block">
//             Manage Users
//           </Link>
//         </div>
        
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="font-medium text-lg mb-2">Categories</h3>
//           <p className="text-3xl font-bold">{totalCategories}</p>
//           <Link href="/administrator/categories" className="text-blue-600 hover:underline mt-2 inline-block">
//             Manage Categories
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome back, {user.name}</span>
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Pending MCQs Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">Pending MCQs</p>
                  <h3 className="text-3xl font-bold mt-1">{pendingMcqs}</h3>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <Link href="/administrator/mcqs" className="mt-4 inline-flex items-center text-sm font-medium text-white/90 hover:text-white transition-colors">
                Review MCQs
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Total Users Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">Total Users</p>
                  <h3 className="text-3xl font-bold mt-1">{totalUsers}</h3>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <Link href="/administrator/users" className="mt-4 inline-flex items-center text-sm font-medium text-white/90 hover:text-white transition-colors">
                Manage Users
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Categories Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">Categories</p>
                  <h3 className="text-3xl font-bold mt-1">{totalCategories}</h3>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
              </div>
              <Link href="/administrator/categories" className="mt-4 inline-flex items-center text-sm font-medium text-white/90 hover:text-white transition-colors">
                Manage Categories
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/administrator/mcqs" className="group flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="bg-blue-100 group-hover:bg-blue-200 p-3 rounded-lg mr-4 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Review MCQs</h3>
                  <p className="text-sm text-gray-500">Approve or reject submissions</p>
                </div>
              </Link>

              <Link href="/administrator/users" className="group flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="bg-purple-100 group-hover:bg-purple-200 p-3 rounded-lg mr-4 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Manage Users</h3>
                  <p className="text-sm text-gray-500">View and edit user accounts</p>
                </div>
              </Link>

              <Link href="/administrator/categories" className="group flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="bg-green-100 group-hover:bg-green-200 p-3 rounded-lg mr-4 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Categories</h3>
                  <p className="text-sm text-gray-500">Organize question categories</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
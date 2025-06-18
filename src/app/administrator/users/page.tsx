import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { redirect } from 'next/navigation';
import { updateUserRole } from './action';
import UserSearch from '@/components/UI/SearchComponent'; 
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';


export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  await dbConnect();
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== 'administrator') {
    redirect('/');
  }

  const searchQuery = searchParams?.query || '';
  
  let usersQuery = User.find({ _id: { $ne: currentUser._id } })
    .select('name email role createdAt')
    .sort({ createdAt: -1 });

  if (searchQuery) {
    usersQuery = usersQuery.or([
      { email: { $regex: searchQuery, $options: 'i' } },
      { name: { $regex: searchQuery, $options: 'i' } },
    ]);
  }

  const users = await usersQuery.lean();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
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
                  User Management
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage user roles and permissions
            </p>
          </div>
          <UserSearch />
        </div>

        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No users found matching your search
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id.toString()} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <form
                          action={async () => {
                            'use server';
                            await updateUserRole(
                              user._id.toString(),
                              user.role === 'admin' ? 'user' : 'admin'
                            );
                          }}
                        >
                          <button
                            type="submit"
                            className={`px-4 py-2 rounded-md font-medium ${
                              user.role === 'user'
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            } transition-colors`}
                          >
                            {user.role === 'user' ? 'Make Admin' : 'Remove Admin'}
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {users.length === 0 ? (
              <div className="text-center py-6 text-sm text-gray-500">
                No users found matching your search
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user._id.toString()}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                    <form
                      action={async () => {
                        'use server';
                        await updateUserRole(
                          user._id.toString(),
                          user.role === 'admin' ? 'user' : 'admin'
                        );
                      }}
                    >
                      <button
                        type="submit"
                        className={`text-xs px-3 py-1.5 rounded-md font-medium ${
                          user.role === 'user'
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        } transition-colors`}
                      >
                        {user.role === 'user' ? 'Make Admin' : 'Remove Admin'}
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
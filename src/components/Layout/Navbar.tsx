import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import Button from '../UI/McqsButton';
import MobileMenu from '@/components/Layout/MobileMenu';

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="lg:flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="hidden lg:block text-2xl font-extrabold text-white tracking-tight">
            MCQ Platform
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {user ? (
              <>
                {user.role === 'user' && (
                  <>
                    <Link href="/dashboard" className="text-white hover:text-blue-200 transition-colors duration-200 font-medium">
                      Dashboard
                    </Link>
                    <Link href="/mcqs" className="text-white hover:text-blue-200 transition-colors duration-200 font-medium">
                      MCQs
                    </Link>
                    <Link href="/papers" className="text-white hover:text-blue-200 transition-colors duration-200 font-medium">
                      Papers
                    </Link>
                    <Link href="/mcqs/add" className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 font-medium">
                      Add MCQ
                    </Link>
                  </>
                )}

                {user.role === 'admin' && (
                  <>
                    <Link href="/admin" className="text-white hover:text-blue-200 transition-colors duration-200 font-medium">
                      Dashboard
                    </Link>
                    <Link href="/admin/mcqs" className="text-white hover:text-blue-200 transition-colors duration-200 font-medium">
                      Review MCQs
                    </Link>
                    <Link href="/admin/papers" className="text-white hover:text-blue-200 transition-colors duration-200 font-medium">
                      Manage Papers
                    </Link>
                    <Link href="/admin/papers/new" className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 font-medium">
                      Create Paper
                    </Link>
                  </>
                )}

                {user.role === 'administrator' && (
                  <>
                    <Link href="/administrator" className="text-white hover:text-blue-200 transition-colors duration-200 font-medium">
                      Dashboard
                    </Link>
                    <Link href="/administrator/users" className="text-white hover:text-blue-200 transition-colors duration-200 font-medium">
                      Manage Users
                    </Link>
                    <Link href="/administrator/categories" className="text-white hover:text-blue-200 transition-colors duration-200 font-medium">
                      Manage Categories
                    </Link>
                    <Link href="/administrator/mcqs" className="text-white hover:text-blue-200 transition-colors duration-200 font-medium">
                      Review MCQs
                    </Link>
                  </>
                )}

                <form action="/api/auth/logout" method="POST">
                  <Button 
                    type="submit" 
                    variant="secondary" 
                    size="sm"
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                  >
                    Logout
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/mcqs" className="text-white hover:text-blue-200 transition-colors duration-200 font-medium">
                  MCQs
                </Link>
                <Link href="/papers" className="text-white hover:text-blue-200 transition-colors duration-200 font-medium">
                  Papers
                </Link>
                <Link href="/login" className="text-white hover:text-blue-200 transition-colors duration-200 font-medium">
                  Login
                </Link>
                <Link href="/register" className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 font-medium">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle (Client Component) */}
          <MobileMenu user={user} />
        </div>
      </div>
    </nav>
  );
}
'use client';

import Link from 'next/link';
import Button from '../UI/McqsButton';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function MobileMenu({ user }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold text-white tracking-tight">
                    MCQ Platform
       </Link>
        
            <button 
        className="lg:hidden text-white"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
        </div>
     
      

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 bg-white rounded-lg shadow-xl p-4">
          {user ? (
            <>
              {user.role === 'user' && (
                <div className="flex flex-col space-y-3">
                  <Link href="/dashboard" className="text-gray-800 hover:text-blue-600 font-medium py-2" onClick={toggleMobileMenu}>
                    Dashboard
                  </Link>
                  <Link href="/mcqs" className="text-gray-800 hover:text-blue-600 font-medium py-2" onClick={toggleMobileMenu}>
                    MCQs
                  </Link>
                  <Link href="/papers" className="text-gray-800 hover:text-blue-600 font-medium py-2" onClick={toggleMobileMenu}>
                    Papers
                  </Link>
                  <Link href="/mcqs/add" className="text-gray-800 hover:text-blue-600 font-medium py-2" onClick={toggleMobileMenu}>
                    Add MCQ
                  </Link>
                </div>
              )}

              {user.role === 'admin' && (
                <div className="flex flex-col space-y-3">
                  <Link href="/admin/dashboard" className="text-gray-800 hover:text-blue-600 font-medium py-2" onClick={toggleMobileMenu}>
                    Admin Dashboard
                  </Link>
                  <Link href="/admin/mcqs" className="text-gray-800 hover:text-blue-600 font-medium py-2" onClick={toggleMobileMenu}>
                    Review MCQs
                  </Link>
                  <Link href="/admin/papers" className="text-gray-800 hover:text-blue-600 font-medium py-2" onClick={toggleMobileMenu}>
                    Manage Papers
                  </Link>
                  <Link href="/admin/papers/new" className="text-gray-800 hover:text-blue-600 font-medium py-2" onClick={toggleMobileMenu}>
                    Create Paper
                  </Link>
                </div>
              )}

              {user.role === 'administrator' && (
                <div className="flex flex-col space-y-3">
                  <Link href="/administrator/dashboard" className="text-gray-800 hover:text-blue-600 font-medium py-2" onClick={toggleMobileMenu}>
                    Admin Dashboard
                  </Link>
                  <Link href="/administrator/users" className="text-gray-800 hover:text-blue-600 font-medium py-2" onClick={toggleMobileMenu}>
                    Manage Users
                  </Link>
                  <Link href="/administrator/categories" className="text-gray-800 hover:text-blue-600 font-medium py-2" onClick={toggleMobileMenu}>
                    Manage Categories
                  </Link>
                  <Link href="/administrator/mcqs" className="text-gray-800 hover:text-blue-600 font-medium py-2" onClick={toggleMobileMenu}>
                    Review MCQs
                  </Link>
                </div>
              )}

              <form action="/api/auth/logout" method="POST" className="mt-4">
                <Button 
                  type="submit" 
                  variant="secondary" 
                  size="sm"
                  className="w-full bg-red-500 text-white hover:bg-red-600 py-2 rounded-lg"
                >
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col space-y-3">
              <Link href="/mcqs" className="text-gray-800 hover:text-blue-600 font-medium py-2" onClick={toggleMobileMenu}>
                MCQs
              </Link>
              <Link href="/papers" className="text-gray-800 hover:text-blue-600 font-medium py-2" onClick={toggleMobileMenu}>
                Papers
              </Link>
              <Link href="/login" className="text-gray-800 hover:text-blue-600 font-medium py-2" onClick={toggleMobileMenu}>
                Login
              </Link>
              <Link href="/register" className="text-gray-800 hover:text-blue-600 font-medium py-2" onClick={toggleMobileMenu}>
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
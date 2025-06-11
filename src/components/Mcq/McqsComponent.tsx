'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface MCQ {
  _id: string;
  statement: string;
  options: string[];
  correctOption: number;
  category?: {
    name: string;
  };
  type?: string;
  createdBy?: {
    name?: string;
  };
  description?: string;
}

interface Category {
  _id: string;
  name: string;
}



interface McqsClientComponentProps {
  mcqs: MCQ[];
  categories: Category[];
}

export default function McqsClientComponent({ 
  mcqs: initialMcqs, 
  categories: initialCategories,
}: McqsClientComponentProps) {
  console.log("initialMcqs", initialMcqs);
  const [mcqs, setMcqs] = useState<MCQ[]>(initialMcqs);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [testMode, setTestMode] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState<{
    correct: number;
    incorrect: number;
    unanswered: number;
    total: number;
    percentage: number;
  } | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, boolean>>({});
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleTestMode = () => {
    setTestMode(!testMode);
    if (!testMode) {
      
      setSelectedOptions({});
      setShowResults(false);
      setTestResults(null);
      setAnsweredQuestions({});
      setCurrentPage(1); // Reset to first page when exiting test mode
    }
  };

  const handleOptionSelect = (mcqId: string, optionIndex: number) => {
    if (!testMode || answeredQuestions[mcqId]) return;

    setSelectedOptions((prev) => ({
      ...prev,
      [mcqId]: optionIndex,
    }));

    setAnsweredQuestions((prev) => ({
      ...prev,
      [mcqId]: true,
    }));
  };

  const calculateResults = () => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    mcqs.forEach((mcq) => {
      if (selectedOptions[mcq._id] === undefined) {
        unanswered++;
      } else if (selectedOptions[mcq._id] === mcq.correctOption) {
        correct++;
      } else {
        incorrect++;
      }
    });

    setTestResults({
      correct,
      incorrect,
      unanswered,
      total: mcqs.length,
      percentage: Math.round((correct / mcqs.length) * 100),
    });
    setShowResults(true);
  };

  const filteredMcqs = selectedCategory
    ? mcqs.filter((mcq) => mcq.category?.name === selectedCategory)
    : mcqs;

  // Pagination logic
  const totalPages = Math.ceil(filteredMcqs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMcqs = filteredMcqs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      {/* Results Modal */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Test Results</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {testResults?.correct}
                </p>
                <p className="text-sm text-green-800">Correct</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {testResults?.incorrect}
                </p>
                <p className="text-sm text-red-800">Incorrect</p>
              </div>
              {/* <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-2xl font-bold text-gray-600">
                  {testResults?.unanswered}
                </p>
                <p className="text-sm text-gray-800">Unanswered</p>
              </div> */}
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-center text-xl font-bold text-blue-600">
                Score: {testResults?.percentage}%
              </p>
              <p className="text-center text-sm text-blue-800">
                ({testResults?.correct} out of {testResults?.total})
              </p>
            </div>
            <div className="flex justify-center">
              <Button onClick={() => setShowResults(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile filter dialog */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-12  pb-12 shadow-xl">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-medium text-gray-900">Categories</h2>
              <button
                type="button"
                className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-gray-400"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 border-t border-gray-200 px-4 py-6">
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setMobileFiltersOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-lg ${
                      !selectedCategory
                        ? 'bg-blue-100 text-blue-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category._id}>
                    <button
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setMobileFiltersOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-lg ${
                        selectedCategory === category.name
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-6 pt-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Multiple Choice Questions
            {selectedCategory && (
              <span className="ml-2 text-blue-600">({selectedCategory})</span>
            )}
          </h1>

          <div className="flex items-center space-x-4">
            <Button
              variant={testMode ? 'destructive' : 'default'}
              onClick={toggleTestMode}
            >
              {testMode ? 'Exit Test Mode' : 'Start Test Mode'}
            </Button>
            {testMode && (
              <Button onClick={calculateResults} variant="secondary">
                Submit Test
              </Button>
            )}
            <button
              type="button"
              className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <Filter className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Filters</span>
            </button>
          </div>
        </div>

        <div className="pt-8 pb-12 lg:grid lg:grid-cols-4 lg:gap-x-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Categories
              </h2>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`block w-full text-left px-3 py-2 rounded-lg ${
                      !selectedCategory
                        ? 'bg-blue-100 text-blue-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category._id}>
                    <button
                      onClick={() => setSelectedCategory(category.name)}
                      className={`block w-full text-left px-3 py-2 rounded-lg ${
                        selectedCategory === category.name
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3">
            {filteredMcqs.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-full h-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No MCQs found
                </h3>
                <p className="mt-1 text-gray-500">
                  {selectedCategory
                    ? `No questions available in ${selectedCategory} category.`
                    : 'No questions available at the moment.'}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {currentMcqs.map((mcq, index) => {
                    const isAnswered = answeredQuestions[mcq._id];
                    const selectedOption = selectedOptions[mcq._id];
                    const isCorrect = selectedOption === mcq.correctOption;
                    const absoluteIndex = startIndex + index;
                    
                    return (
                      <div
                        key={mcq._id}
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-800 font-bold mr-4 mt-1">
                            {absoluteIndex + 1}
                          </div>
                          <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                              {mcq.statement}
                            </h2>

                            <ul className="space-y-3 mb-4">
                              {mcq.options.map((option, i) => {
                                const isSelected = selectedOption === i;
                                const showCorrectAnswer = isAnswered && i === mcq.correctOption;

                                return (
                                  <li
                                    key={i}
                                    onClick={() => handleOptionSelect(mcq._id, i)}
                                    className={`p-3 rounded-lg transition-all duration-200 ${
                                      isAnswered 
                                        ? 'cursor-default' 
                                        : 'cursor-pointer'
                                    } ${
                                      !testMode && i === mcq.correctOption
                                        ? 'bg-green-50 border border-green-200 text-green-900 font-medium'
                                        : isAnswered && isSelected
                                        ? isCorrect
                                          ? 'bg-green-50 border border-green-200 text-green-900 font-medium'
                                          : 'bg-red-50 border border-red-200 text-red-900 font-medium'
                                        : isAnswered && showCorrectAnswer
                                        ? 'bg-green-50 border border-green-200 text-green-900 font-medium'
                                        : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                                    }`}
                                  >
                                    <span className="font-semibold mr-2">
                                      {String.fromCharCode(65 + i)}.
                                    </span>
                                    {option}
                                  </li>
                                );
                              })}
                            </ul>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {mcq.category?.name || 'N/A'}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {mcq.type || 'N/A'}
                              </span>
                              <span className="text-gray-500 text-sm">
                                Added by: {mcq.createdBy?.name || 'Unknown'}
                              </span>
                            </div>

                            {mcq.description && !testMode && (
                              <div>
                                <button
                                  onClick={() => toggleDescription(mcq._id)}
                                  className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 group"
                                >
                                  {expandedDescriptions[mcq._id]
                                    ? 'Hide Explanation'
                                    : 'Show Explanation'}
                                  {expandedDescriptions[mcq._id] ? (
                                    <ChevronUp className="ml-2 h-5 w-5 group-hover:translate-y-[-2px] transition-transform" />
                                  ) : (
                                    <ChevronDown className="ml-2 h-5 w-5 group-hover:translate-y-[2px] transition-transform" />
                                  )}
                                </button>
                                {expandedDescriptions[mcq._id] && (
                                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 prose prose-sm max-w-none text-gray-700">
                                    <h4 className="text-sm font-semibold text-gray-600 mb-2">
                                      Explanation:
                                    </h4>
                                    <div className='ck-content'
                                      dangerouslySetInnerHTML={{ __html: mcq.description }}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(currentPage - 1);
                            }}
                            isActive={currentPage > 1}
                          />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                              isActive={page === currentPage}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(currentPage + 1);
                            }}
                            isActive={currentPage < totalPages}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Mcq } from '@/types';

interface McqListProps {
  mcqs: Mcq[];
  onMcqClick?: (mcq: Mcq) => void;
  showStatus?: boolean;
}

const McqList: React.FC<McqListProps> = ({ mcqs, onMcqClick, showStatus = false }) => {
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const toggleDescription = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      {mcqs.map((mcq) => {
        const isExpanded = expandedIds.includes(mcq.id);
        return (
          <div 
            key={mcq.id} 
            className={`p-4 border rounded-lg transition-shadow ${
              onMcqClick ? 'cursor-pointer hover:border-blue-500 hover:shadow-md' : ''
            }`}
            onClick={() => onMcqClick && onMcqClick(mcq)}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg">{mcq.statement}</h3>
              {showStatus && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  mcq.status === 'approved' ? 'bg-green-100 text-green-800' :
                  mcq.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {mcq.status}
                </span>
              )}
            </div>

            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              {mcq.options.map((option, index) => (
                <div 
                  key={index} 
                  className={`p-2 rounded ${
                    index === mcq.correctOption ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                  }`}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </div>
              ))}
            </div>

            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-gray-500">Category: {mcq.category.name}</span>
              <span className="text-sm text-gray-500 capitalize">Difficulty: {mcq.type}</span>
            </div>

            {mcq.description && (
              <div className="mt-2">
                <button
                  onClick={() => toggleDescription(mcq.id)}
                  className="text-blue-600 text-sm mt-2 hover:underline"
                >
                  {isExpanded ? 'Hide Description' : 'Show Description'}
                </button>

                {isExpanded && (
                  <div
                    className="ck-content mt-2 text-sm"
                    dangerouslySetInnerHTML={{ __html: mcq.description }}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default McqList;

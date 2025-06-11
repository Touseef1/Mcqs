'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

import { McqActions } from './mcqsaction'; // Assuming McqActions is extracted

type McqType = {
  _id: string;
  statement: string;
  options: string[];
  correctOption: number;
  category: { name: string };
  createdBy: { name: string; email: string };
  description?: string;
  type: string;
  status: string;
  createdAt: Date;
};

// export default function AdminMcqsClient({
//   mcqs,
// }: {
//   mcqs: McqType[];
// }) {
export default function AdminMcqsClient({ mcqs: initialMcqs }: { mcqs: McqType[] }) {
  const [mcqs, setMcqs] = useState<McqType[]>(initialMcqs);

  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchType, setSearchType] = useState<'statement' | 'email'>('statement');
  const [search, setSearch] = useState('');
  const [filteredMcqs, setFilteredMcqs] = useState<McqType[]>([]);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const toggleDescription = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };
  useEffect(() => {
    let filtered = mcqs.filter((m) => m.status === tab);

    if (search.trim()) {
      filtered = filtered.filter((m) =>
        searchType === 'statement'
          ? m.statement.toLowerCase().includes(search.toLowerCase())
          : m.createdBy.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredMcqs(filtered);
  }, [tab, search, searchType, mcqs]);

  async function updateStatus(id: string, status: string) {
  const res = await fetch(`/api/mcqs/update-status`, {
    method: 'POST',
    body: JSON.stringify({ id, status }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (res.ok) {
    const updatedMcqs = mcqs.map((m) =>
      m._id === id ? { ...m, status } : m
    );
    setMcqs(updatedMcqs); // 🔧 Update full list
    const filtered = updatedMcqs.filter((m) =>
      m.status === tab &&
      (search.trim()
        ? searchType === 'statement'
          ? m.statement.toLowerCase().includes(search.toLowerCase())
          : m.createdBy.email.toLowerCase().includes(search.toLowerCase())
        : true)
    );
    setFilteredMcqs(filtered); // 🔧 Update filtered list
  }
}


  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">MCQ Management Panel</h1>

      <div className="flex items-center gap-4 mb-6">
        <Select value={searchType} onValueChange={(val) => setSearchType(val as any)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Search by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="statement">Search by Question</SelectItem>
            <SelectItem value="email">Search by Email</SelectItem>
          </SelectContent>
        </Select>

        <Input
          className="w-full max-w-md"
          placeholder={`Search ${searchType === 'email' ? 'by email...' : 'question...'}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Tabs value={tab} onValueChange={(val) => setTab(val as any)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
  {filteredMcqs.length === 0 ? (
    <p className="text-gray-500 mt-4">No MCQs found.</p>
  ) : (
    <div className="space-y-4 mt-4">
      {filteredMcqs.map((mcq) => {
        const isExpanded = expandedIds.includes(mcq._id as unknown as number); // Adjust if your _id is a string
        return (
          <div key={mcq._id} className="border p-4 rounded shadow">
            <div className="mb-4">
              <p className="font-semibold text-lg">{mcq.statement}</p>
              <p className="text-sm text-gray-600">
                Submitted by: {mcq.createdBy?.name} ({mcq.createdBy.email})
              </p>
              <p className="text-sm text-gray-600">
                Category: {mcq.category?.name} | Difficulty: {mcq.type}
              </p>
              <p className="text-sm text-gray-600">
                Submitted on: {new Date(mcq.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Options:</h4>
              <ul className="list-disc list-inside pl-4">
                {mcq.options.map((opt, idx) => (
                  <li
                    key={idx}
                    className={idx === mcq.correctOption ? 'text-green-600 font-medium' : ''}
                  >
                    {opt} {idx === mcq.correctOption && '(Correct Answer)'}
                  </li>
                ))}
              </ul>
            </div>

            {mcq.description && (
              <div className="mt-2">
                <button
                  onClick={() => toggleDescription(mcq._id as unknown as number)}
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

            <McqActions
              id={mcq._id}
              currentStatus={mcq.status}
              updateStatus={updateStatus}
            />
          </div>
        );
      })}
    </div>
  )}
</TabsContent>

      </Tabs>
    </div>
  );
}

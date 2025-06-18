// 'use client';

// import { useEffect, useState } from 'react';
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
// import { Input } from '@/components/ui/input';
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
// import { McqActions } from './mcqsaction';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { ChevronDown, ChevronUp } from 'lucide-react';
// import Link from 'next/link';
// import { ChevronRight, Home } from 'lucide-react';

// type McqType = {
//   _id: string;
//   statement: string;
//   options: string[];
//   correctOption: number;
//   category: { name: string };
//   createdBy: { name: string; email: string };
//   description?: string;
//   type: string;
//   status: string;
//   createdAt: Date;
// };

// export default function AdminMcqsClient({ mcqs: initialMcqs }: { mcqs: McqType[] }) {
//   const [mcqs, setMcqs] = useState<McqType[]>(initialMcqs);
//   const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
//   const [searchType, setSearchType] = useState<'statement' | 'email'>('statement');
//   const [search, setSearch] = useState('');
//   const [filteredMcqs, setFilteredMcqs] = useState<McqType[]>([]);
//   const [expandedIds, setExpandedIds] = useState<string[]>([]);

//   const toggleDescription = (id: string) => {
//     setExpandedIds((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   useEffect(() => {
//     let filtered = mcqs.filter((m) => m.status === tab);

//     if (search.trim()) {
//       filtered = filtered.filter((m) =>
//         searchType === 'statement'
//           ? m.statement.toLowerCase().includes(search.toLowerCase())
//           : m.createdBy.email.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     setFilteredMcqs(filtered);
//   }, [tab, search, searchType, mcqs]);

//   async function updateStatus(id: string, status: string) {
//     const res = await fetch(`/api/mcqs/update-status`, {
//       method: 'POST',
//       body: JSON.stringify({ id, status }),
//       headers: { 'Content-Type': 'application/json' },
//     });

//     if (res.ok) {
//       const updatedMcqs = mcqs.map((m) =>
//         m._id === id ? { ...m, status } : m
//       );
//       setMcqs(updatedMcqs);
//       const filtered = updatedMcqs.filter((m) =>
//         m.status === tab &&
//         (search.trim()
//           ? searchType === 'statement'
//             ? m.statement.toLowerCase().includes(search.toLowerCase())
//             : m.createdBy.email.toLowerCase().includes(search.toLowerCase())
//           : true)
//       );
//       setFilteredMcqs(filtered);
//     }
//   }

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'approved':
//         return <Badge variant="success">Approved</Badge>;
//       case 'rejected':
//         return <Badge variant="destructive">Rejected</Badge>;
//       default:
//         return <Badge variant="yellow">Pending</Badge>;
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <nav className="mb-6 flex" aria-label="Breadcrumb">
//                       <ol className="flex items-center space-x-4">
//                         <li>
//                           <div>
//                             <Link href="/administrator" className="text-gray-400 hover:text-gray-500">
//                               <Home className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
//                               <span className="sr-only">Home</span>
//                             </Link>
//                           </div>
//                         </li>
//                         <li>
//                           <div className="flex items-center">
//                             <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
//                             <Link
//                               href="/administrator"
//                               className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
//                             >
//                               Dashboard
//                             </Link>
//                           </div>
//                         </li>
//                         <li>
//                           <div className="flex items-center">
//                             <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
//                             <span className="ml-4 text-sm font-medium text-gray-500" aria-current="page">
//                               MCQS Management
//                             </span>
//                           </div>
//                         </li>
//                       </ol>
//                     </nav>
//       <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-6">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MCQ Management</h1>
//             <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
//               Review and manage submitted multiple choice questions
//             </p>
//           </div>
          
//           <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
//             <Select value={searchType} onValueChange={(val) => setSearchType(val as any)}>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Search by..." />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="statement">Question</SelectItem>
//                 <SelectItem value="email">Submitter Email</SelectItem>
//               </SelectContent>
//             </Select>

//             <Input
//               className="w-full sm:w-64"
//               placeholder={`Search ${searchType === 'email' ? 'emails...' : 'questions...'}`}
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//         </div>

//         <Tabs value={tab} onValueChange={(val) => setTab(val as any)} className="w-full">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="pending">
//               <span className="flex items-center gap-2">
//                 <span>Pending</span>
//                 <Badge variant="outline" className="px-1.5 py-0.5">
//                   {mcqs.filter(m => m.status === 'pending').length}
//                 </Badge>
//               </span>
//             </TabsTrigger>
//             <TabsTrigger value="approved">
//               <span className="flex items-center gap-2">
//                 <span>Approved</span>
//                 <Badge variant="outline" className="px-1.5 py-0.5">
//                   {mcqs.filter(m => m.status === 'approved').length}
//                 </Badge>
//               </span>
//             </TabsTrigger>
//             <TabsTrigger value="rejected">
//               <span className="flex items-center gap-2">
//                 <span>Rejected</span>
//                 <Badge variant="outline" className="px-1.5 py-0.5">
//                   {mcqs.filter(m => m.status === 'rejected').length}
//                 </Badge>
//               </span>
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value={tab} className="mt-6">
//             {filteredMcqs.length === 0 ? (
//               <div className="text-center py-12">
//                 <p className="text-gray-500 dark:text-gray-400">No MCQs found matching your criteria.</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {filteredMcqs.map((mcq) => {
//                   const isExpanded = expandedIds.includes(mcq._id);
//                   return (
//                     <Card key={mcq._id} className="overflow-hidden">
//                       <CardHeader className="bg-gray-50 dark:bg-gray-800 p-4">
//                         <div className="flex justify-between items-start">
//                           <div className="space-y-1">
//                             <div className="flex items-center gap-2">
//                               <h3 className="font-semibold text-lg">{mcq.statement}</h3>
//                               {getStatusBadge(mcq.status)}
//                             </div>
//                             <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-300">
//                               <span>Category: {mcq.category?.name || 'Uncategorized'}</span>
//                               <span>•</span>
//                               <span>Type: {mcq.type}</span>
//                               <span>•</span>
//                               <span>
//                                 Submitted: {new Date(mcq.createdAt).toLocaleDateString('en-US', {
//                                   year: 'numeric',
//                                   month: 'short',
//                                   day: 'numeric',
//                                   hour: '2-digit',
//                                   minute: '2-digit'
//                                 })}
//                               </span>
//                             </div>
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => toggleDescription(mcq._id)}
//                             className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
//                           >
//                             {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//                           </Button>
//                         </div>
//                       </CardHeader>
                      
//                       <CardContent className="p-4 space-y-4">
//                         <div>
//                           <h4 className="font-medium mb-2">Options:</h4>
//                           <ul className="space-y-2">
//                             {mcq.options.map((opt, idx) => (
//                               <li
//                                 key={idx}
//                                 className={`p-3 rounded-md border ${
//                                   idx === mcq.correctOption
//                                     ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
//                                     : 'border-gray-200 dark:border-gray-700'
//                                 }`}
//                               >
//                                 <div className="flex items-start gap-2">
//                                   <span className="font-medium">{String.fromCharCode(65 + idx)}.</span>
//                                   <span>{opt}</span>
//                                   {idx === mcq.correctOption && (
//                                     <Badge variant="success" className="ml-auto">
//                                       Correct
//                                     </Badge>
//                                   )}
//                                 </div>
//                               </li>
//                             ))}
//                           </ul>
//                         </div>

//                         {mcq.description && isExpanded && (
//                           <div>
//                             <h4 className="font-medium mb-2">Description:</h4>
//                             <div className="prose dark:prose-invert max-w-none p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
//                               {mcq.description}
//                             </div>
//                           </div>
//                         )}
//                       </CardContent>

//                       <CardFooter className="bg-gray-50 dark:bg-gray-800 p-4 border-t">
//                         <div className="flex justify-between items-center w-full">
//                           <div className="text-sm text-gray-600 dark:text-gray-300">
//                             Submitted by: {mcq.createdBy?.name} ({mcq.createdBy.email})
//                           </div>
//                           <McqActions
//                             id={mcq._id}
//                             currentStatus={mcq.status}
//                             updateStatus={updateStatus}
//                           />
//                         </div>
//                       </CardFooter>
//                     </Card>
//                   );
//                 })}
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, MoreHorizontal, Trash2, Edit, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'react-toastify';


type McqType = {
  _id: string;
  statement: string;
  options: string[];
  correctOption: number;
  category: { _id?: string; name: string };
  createdBy: { _id?: string; name: string; email: string };
  description?: string;
  type: string;
  status: string;
  createdAt: Date;
};

export default function AdminMcqsClient({ mcqs: initialMcqs }: { mcqs: McqType[] }) {
  const [mcqs, setMcqs] = useState<McqType[]>(initialMcqs);
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchType, setSearchType] = useState<'statement' | 'email'>('statement');
  const [search, setSearch] = useState('');
  const [filteredMcqs, setFilteredMcqs] = useState<McqType[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentMcq, setCurrentMcq] = useState<McqType | null>(null);
  const [editForm, setEditForm] = useState({
    statement: '',
    options: ['', '', '', ''],
    correctOption: 0,
    description: '',
    type: '',
    category: '',
  });

  const router = useRouter();

  const toggleDescription = (id: string) => {
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
      setMcqs(updatedMcqs);
      const filtered = updatedMcqs.filter((m) =>
        m.status === tab &&
        (search.trim()
          ? searchType === 'statement'
            ? m.statement.toLowerCase().includes(search.toLowerCase())
            : m.createdBy.email.toLowerCase().includes(search.toLowerCase())
          : true)
      );
      setFilteredMcqs(filtered);
      toast.success(`MCQ has been ${status}`);
    } else {
      toast.error('Failed to update status');
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/mcqs/delete', {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        setMcqs(mcqs.filter(m => m._id !== id));
        // toast({
        //   title: 'Success',
        //   description: 'MCQ deleted successfully',
        // });
        toast.success('MCQ deleted successfully');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      // toast({
      //   title: 'Error',
      //   description: 'Failed to delete MCQ',
      //   variant: 'destructive',
      // });
      toast.error('Failed to delete MCQ');
    }
  };

  const handleEdit = (mcq: McqType) => {
    setCurrentMcq(mcq);
    setEditForm({
      statement: mcq.statement,
      options: [...mcq.options],
      correctOption: mcq.correctOption,
      description: mcq.description || '',
      type: mcq.type,
      category: mcq.category?._id?.toString() || '',
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!currentMcq) return;

    try {
      const res = await fetch('/api/mcqs/update-status', {
        method: 'POST',
        body: JSON.stringify({
          id: currentMcq._id,
          ...editForm,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const updatedMcqs = mcqs.map(m =>
          m._id === currentMcq._id
            ? {
                ...m,
                ...editForm,
                category: mcqs.find(m => m._id === currentMcq._id)?.category,
              }
            : m
        );
        setMcqs(updatedMcqs);
        setEditDialogOpen(false);
        // toast({
        //   title: 'Success',
        //   description: 'MCQ updated successfully',
        // });
        toast.success('MCQ updated successfully');
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      // toast({
      //   title: 'Error',
      //   description: 'Failed to update MCQ',
      //   variant: 'destructive',
      // });
      toast.error('Failed to update MCQ');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="yellow">Pending</Badge>;
    }
  };

  function McqActions({
    id,
    currentStatus,
    updateStatus,
    onDelete,
    onEdit,
  }: {
    id: string;
    currentStatus: string;
    updateStatus: (id: string, status: string) => void;
    onDelete: (id: string) => void;
    onEdit: () => void;
  }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {currentStatus !== 'approved' && (
            <DropdownMenuItem
              onClick={() => updateStatus(id, 'approved')}
              className="text-green-600 focus:text-green-600"
            >
              Approve
            </DropdownMenuItem>
          )}
          {currentStatus !== 'rejected' && (
            <DropdownMenuItem
              onClick={() => updateStatus(id, 'rejected')}
              className="text-red-600 focus:text-red-600"
            >
              Reject
            </DropdownMenuItem>
          )}
          {currentStatus !== 'pending' && (
            <DropdownMenuItem
              onClick={() => updateStatus(id, 'pending')}
              className="text-yellow-600 focus:text-yellow-600"
            >
              Mark as Pending
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(id)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

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
                MCQS Management
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MCQ Management</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Review and manage submitted multiple choice questions
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <Select value={searchType} onValueChange={(val) => setSearchType(val as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Search by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="statement">Question</SelectItem>
                <SelectItem value="email">Submitter Email</SelectItem>
              </SelectContent>
            </Select>

            <Input
              className="w-full sm:w-64"
              placeholder={`Search ${searchType === 'email' ? 'emails...' : 'questions...'}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={tab} onValueChange={(val) => setTab(val as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              <span className="flex items-center gap-2">
                <span>Pending</span>
                <Badge variant="outline" className="px-1.5 py-0.5">
                  {mcqs.filter(m => m.status === 'pending').length}
                </Badge>
              </span>
            </TabsTrigger>
            <TabsTrigger value="approved">
              <span className="flex items-center gap-2">
                <span>Approved</span>
                <Badge variant="outline" className="px-1.5 py-0.5">
                  {mcqs.filter(m => m.status === 'approved').length}
                </Badge>
              </span>
            </TabsTrigger>
            <TabsTrigger value="rejected">
              <span className="flex items-center gap-2">
                <span>Rejected</span>
                <Badge variant="outline" className="px-1.5 py-0.5">
                  {mcqs.filter(m => m.status === 'rejected').length}
                </Badge>
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-6">
            {filteredMcqs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No MCQs found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMcqs.map((mcq) => {
                  const isExpanded = expandedIds.includes(mcq._id);
                  return (
                    <Card key={mcq._id} className="overflow-hidden">
                      <CardHeader className="bg-gray-50 dark:bg-gray-800 p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{mcq.statement}</h3>
                              {getStatusBadge(mcq.status)}
                            </div>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <span>Category: {mcq.category?.name || 'Uncategorized'}</span>
                              <span>•</span>
                              <span>Type: {mcq.type}</span>
                              <span>•</span>
                              <span>
                                Submitted: {new Date(mcq.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleDescription(mcq._id)}
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </Button>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-4 space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Options:</h4>
                          <ul className="space-y-2">
                            {mcq.options.map((opt, idx) => (
                              <li
                                key={idx}
                                className={`p-3 rounded-md border ${
                                  idx === mcq.correctOption
                                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                                    : 'border-gray-200 dark:border-gray-700'
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <span className="font-medium">{String.fromCharCode(65 + idx)}.</span>
                                  <span>{opt}</span>
                                  {idx === mcq.correctOption && (
                                    <Badge variant="success" className="ml-auto">
                                      Correct
                                    </Badge>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {mcq.description && isExpanded && (
                          <div>
                            <h4 className="font-medium mb-2">Description:</h4>
                            <div className="prose dark:prose-invert max-w-none p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                              {mcq.description}
                            </div>
                          </div>
                        )}
                      </CardContent>

                      <CardFooter className="bg-gray-50 dark:bg-gray-800 p-4 border-t">
                        <div className="flex justify-between items-center w-full">
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Submitted by: {mcq.createdBy?.name} ({mcq.createdBy.email})
                          </div>
                          <McqActions
                            id={mcq._id}
                            currentStatus={mcq.status}
                            updateStatus={updateStatus}
                            onDelete={handleDelete}
                            onEdit={() => handleEdit(mcq)}
                          />
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit MCQ Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit MCQ</DialogTitle>
          </DialogHeader>
          {currentMcq && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="statement">Question Statement</Label>
                <Textarea
                  id="statement"
                  value={editForm.statement}
                  onChange={(e) =>
                    setEditForm({ ...editForm, statement: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Options</Label>
                {editForm.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...editForm.options];
                        newOptions[index] = e.target.value;
                        setEditForm({ ...editForm, options: newOptions });
                      }}
                    />
                    <Button
                      variant={editForm.correctOption === index ? 'default' : 'outline'}
                      onClick={() =>
                        setEditForm({ ...editForm, correctOption: index })
                      }
                    >
                      Correct
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Explanation (Optional)</Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdate}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
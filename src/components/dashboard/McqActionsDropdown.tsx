'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

type McqActionsDropdownProps = {
  mcqId: string;
  status: 'pending' | 'approved' | 'rejected';
};

export function McqActionsDropdown({ mcqId, status }: McqActionsDropdownProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const res = await fetch('/api/mcqs/delete', {
        method: 'POST',
        body: JSON.stringify({ id: mcqId }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        // toast({
        //   title: 'Success',
        //   description: 'MCQ deleted successfully',
        // });
        toast.success('MCQ deleted successfully');
        router.refresh();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
        toast.error('Failed to delete MCQ');
    //   toast({
    //     title: 'Error',
    //     description: 'Failed to delete MCQ',
    //     variant: 'destructive',
    //   });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* {status !== 'approved' && (
          <DropdownMenuItem asChild>
            <Link href={`/mcqs/edit/${mcqId}`} className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              {status === 'pending' ? 'Edit' : 'Edit & Resubmit'}
            </Link>
          </DropdownMenuItem>
        )} */}
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600"
          onClick={handleDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


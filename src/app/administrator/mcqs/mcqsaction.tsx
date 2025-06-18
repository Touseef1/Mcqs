// 'use client';

// import { useTransition } from 'react';
// import { Button } from '@/components/ui/button';

// export function McqActions({
//   id,
//   currentStatus,
//   updateStatus,
// }: {
//   id: string;
//   currentStatus: string;
//   updateStatus: (id: string, status: string) => Promise<void>;
// }) {
//   const [isPending, startTransition] = useTransition();

//   const handleChange = (newStatus: string) => {
//     startTransition(async () => {
//       await updateStatus(id, newStatus);
//     });
//   };

//   return (
//     <div className="flex gap-2">
//       {currentStatus !== 'approved' && (
//         <Button
//           size="sm"
//           variant="secondary"
//           onClick={() => handleChange('approved')}
//           disabled={isPending}
//         >
//           Approve
//         </Button>
//       )}
//       {currentStatus !== 'rejected' && (
//         <Button
//           size="sm"
//           variant="destructive"
//           onClick={() => handleChange('rejected')}
//           disabled={isPending}
//         >
//           Reject
//         </Button>
//       )}
//     </div>
//   );
// }



import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash2, Edit } from 'lucide-react';

export function McqActions({
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
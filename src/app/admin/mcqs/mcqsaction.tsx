'use client';

import { useTransition, useState } from 'react';

export function McqActions({
  id,
  currentStatus,
  updateStatus,
}: {
  id: string;
  currentStatus: string;
  updateStatus: (id: string, status: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);

  const handleChange = (newStatus: string) => {
    startTransition(async () => {
      await updateStatus(id, newStatus);
      setStatus(newStatus);
    });
  };

  return (
    <div className="flex gap-4 mt-4">
      {status !== 'approved' && (
        <button
          onClick={() => handleChange('approved')}
          disabled={isPending}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Approve
        </button>
      )}
      {status !== 'rejected' && (
        <button
          onClick={() => handleChange('rejected')}
          disabled={isPending}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reject
        </button>
      )}
    </div>
  );
}

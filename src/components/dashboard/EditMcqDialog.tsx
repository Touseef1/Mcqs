'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';

type Mcq = {
  _id: string;
  statement: string;
  options: string[];
  correctOption: number;
  description?: string;
  type: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
};

type EditMcqDialogProps = {
  mcq: Mcq;
  onUpdate: (updatedMcq: Partial<Mcq>) => Promise<void>;
  children: React.ReactNode;
};

export function EditMcqDialog({ mcq, onUpdate, children }: EditMcqDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    statement: mcq.statement,
    options: [...mcq.options],
    correctOption: mcq.correctOption,
    description: mcq.description || '',
    type: mcq.type,
    category: mcq.category,
  });

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdate(formData);
      toast.success('MCQ updated successfully');
      setOpen(false);
    } catch (error) {
      toast.error('Failed to update MCQ');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit MCQ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="statement">Question Statement</Label>
            <Textarea
              id="statement"
              value={formData.statement}
              onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Options</Label>
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant={formData.correctOption === index ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, correctOption: index })}
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
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
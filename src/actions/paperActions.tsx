'use server';

import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import Paper from '@/models/Paper';
import Mcq from '@/models/Mcq';

export async function deletePaper(paperId: string) {
  await dbConnect();
  
  try {
    // First delete all MCQs associated with this paper
    await Mcq.deleteMany({ paper: paperId });
    
    // Then delete the paper itself
    await Paper.findByIdAndDelete(paperId);
    revalidatePath('/admin/papers');
    return { success: true };
  } catch (error) {
    console.error('Error deleting paper:', error);
    return { success: false, error: 'Failed to delete paper' };
  }
}

export async function updatePaper(paperId: string, data: any) {
  await dbConnect();
  
  try {
    const updatedPaper = await Paper.findByIdAndUpdate(
      paperId,
      { $set: data },
      { new: true }
    );
    
    revalidatePath(`/admin/papers/${paperId}`);
    revalidatePath('/admin/papers');
    return { success: true, paper: updatedPaper };
  } catch (error) {
    console.error('Error updating paper:', error);
    return { success: false, error: 'Failed to update paper' };
  }
}
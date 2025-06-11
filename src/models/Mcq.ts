import mongoose, { Document, Schema } from 'mongoose';

export interface IMcq extends Document {
  statement: string;
  options: string[];
  correctOption: number;
  type: 'easy' | 'medium' | 'hard';
  category: mongoose.Types.ObjectId;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  paper?: mongoose.Types.ObjectId; // Reference to paper

}

const McqSchema: Schema = new Schema({
  statement: { type: String, required: true },
  options: { type: [String], required: true, validate: [arrayLimit, '{PATH} must have exactly 4 items'] },
  correctOption: { type: Number, required: true, min: 0, max: 3 },
  type: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  paper: { type: Schema.Types.ObjectId, ref: 'Paper' }
});

function arrayLimit(val: string[]) {
  return val.length === 4;
}

export default mongoose.models.Mcq || mongoose.model<IMcq>('Mcq', McqSchema);
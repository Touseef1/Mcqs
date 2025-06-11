import mongoose, { Document, Schema } from 'mongoose';

export interface IPaper extends Document {
  name: string;
  description?: string;
  // category: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  mcqs: mongoose.Types.ObjectId[];
}

const PaperSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  // category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  mcqs: [{ type: Schema.Types.ObjectId, ref: 'Mcq' }]
});

export default mongoose.models.Paper || mongoose.model<IPaper>('Paper', PaperSchema);
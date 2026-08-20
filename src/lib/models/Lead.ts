import mongoose, { Schema, Document, Model } from 'mongoose';
import { LeadItem } from '../types';

export interface ILeadDoc extends Omit<LeadItem, 'id'>, Document {
  id: string;
}

const LeadSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ['quotation', 'contact'], required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerCity: { type: String },
    vehicleCategory: { type: String },
    vehicleName: { type: String },
    selectedOptions: [{ type: String }],
    estimatedPrice: { type: Number },
    quotationRef: { type: String },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Quoted', 'Converted', 'Completed', 'Closed', 'Archived'],
      default: 'New',
    },
    smsStatus: {
      type: String,
      enum: ['Sent', 'Failed', 'Simulated', 'Pending'],
      default: 'Pending',
    },
    subject: { type: String },
    message: { type: String },
    customerNotes: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Lead: Model<ILeadDoc> =
  mongoose.models.Lead || mongoose.model<ILeadDoc>('Lead', LeadSchema);

export default Lead;

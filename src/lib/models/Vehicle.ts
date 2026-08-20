import mongoose, { Schema, Document, Model } from 'mongoose';
import { VehicleItem } from '../types';

export interface IVehicleDoc extends Omit<VehicleItem, 'id'>, Document {
  id: string;
}

const VehicleOptionSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    defaultSelected: { type: Boolean, default: false },
  },
  { _id: false }
);

const VehicleSpecsSchema = new Schema(
  {
    chassisCompatibility: { type: String, default: '' },
    sheetMaterial: { type: String, default: '' },
    floorPlate: { type: String, default: '' },
    paintFinish: { type: String, default: '' },
    dimensions: { type: String, default: '' },
    warranty: { type: String, default: '' },
  },
  { _id: false }
);

const VehicleSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    tagline: { type: String, default: '' },
    category: { type: String, required: true },
    categoryColor: { type: String },
    badge: { type: String },
    badgeColor: { type: String },
    coverImage: { type: String, required: true },
    gallery: [{ type: String }],
    galleryImages: [{ type: String }],
    description: { type: String, default: '' },
    specs: { type: VehicleSpecsSchema, default: () => ({}) },
    standardOptions: [{ type: String }],
    availableOptions: [VehicleOptionSchema],
    isPopular: { type: Boolean, default: false },
    basePrice: { type: Number, required: true, default: 0 },
    leadTime: { type: String, default: '5 - 7 Days' },
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

export const Vehicle: Model<IVehicleDoc> =
  mongoose.models.Vehicle || mongoose.model<IVehicleDoc>('Vehicle', VehicleSchema);

export default Vehicle;

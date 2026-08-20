import mongoose, { Schema, Document, Model } from 'mongoose';
import { SiteContent } from '../types';

export interface ISiteContentDoc extends SiteContent, Document {
  key: string;
}

const SiteContentSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: 'main' },
    theme: { type: Schema.Types.Mixed, default: () => ({}) },
    company: { type: Schema.Types.Mixed, default: () => ({}) },
    home: { type: Schema.Types.Mixed, default: () => ({}) },
    about: { type: Schema.Types.Mixed, default: () => ({}) },
    services: { type: Schema.Types.Mixed, default: () => ({}) },
    contact: { type: Schema.Types.Mixed, default: () => ({}) },
  },
  {
    timestamps: true,
    minimize: false,
    toJSON: {
      transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.key;
        return ret;
      },
    },
  }
);

export const SiteContentModel: Model<ISiteContentDoc> =
  mongoose.models.SiteContent || mongoose.model<ISiteContentDoc>('SiteContent', SiteContentSchema);

export default SiteContentModel;

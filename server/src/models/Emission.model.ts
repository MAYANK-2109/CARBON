/**
 * @module models/Emission
 * @description Mongoose model for individual emission calculation records.
 * Optimized with compound indexes for time-series queries.
 */

import mongoose, { Document, Schema } from 'mongoose';

/** Emission document interface */
export interface IEmission extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  category: 'travel' | 'energy' | 'diet';
  subcategory: string;
  inputValue: number;
  inputUnit: string;
  co2eKg: number;
  createdAt: Date;
}

const EmissionSchema = new Schema<IEmission>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['travel', 'energy', 'diet'],
    },
    subcategory: {
      type: String,
      required: true,
      trim: true,
    },
    inputValue: {
      type: Number,
      required: true,
      min: 0,
    },
    inputUnit: {
      type: String,
      required: true,
      trim: true,
    },
    co2eKg: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id.toString();
        ret.userId = ret.userId.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ─── Optimized Indexes for Time-Series Queries ───────────
/** User history queries — descending time for "recent first" */
EmissionSchema.index({ userId: 1, createdAt: -1 });

/** Category-filtered history queries */
EmissionSchema.index({ userId: 1, category: 1, createdAt: -1 });

export const Emission = mongoose.model<IEmission>('Emission', EmissionSchema);

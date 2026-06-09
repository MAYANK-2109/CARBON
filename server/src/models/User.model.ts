/**
 * @module models/User
 * @description Mongoose model for user accounts.
 * Stores authentication credentials with encrypted PII.
 */

import mongoose, { Document, Schema } from 'mongoose';

/** User document interface */
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 255,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

// ─── Indexes ─────────────────────────────────────────────
UserSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model<IUser>('User', UserSchema);

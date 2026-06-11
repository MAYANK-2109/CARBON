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
      transform(_doc, ret: Record<string, unknown>) {
        ret['id'] = String(ret['_id']);
        delete ret['_id'];
        delete ret['__v'];
        delete ret['passwordHash'];
        return ret;
      },
    },
  }
);

// ─── Indexes ─────────────────────────────────────────────
// (email index is implicitly created via unique: true on the schema definition)

export const User = mongoose.model<IUser>('User', UserSchema);

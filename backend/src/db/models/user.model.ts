import mongoose from 'mongoose';

import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  profileImg?: string;
  password: string;
  isActive: boolean;
  tokenVersion: number;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    /**
     * This will be used to invalidate all tokens when either
     * 1- password is changed.
     * 2- block user by admin.
     */
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

UserSchema.plugin(softDeletePlugin);

export default mongoose.model<IUser, SoftDeleteModel<IUser>>('User', UserSchema);

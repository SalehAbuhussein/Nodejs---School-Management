import mongoose from 'mongoose';

import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';

export interface ITeacher extends mongoose.Document {
  firstName: string;
  secondName: string;
  thirdName: string | null;
  lastName: string;
  isActive: boolean;
  userId: mongoose.Schema.Types.ObjectId;
}

const TeacherSchema = new mongoose.Schema<ITeacher>(
  {
    firstName: {
      type: String,
      required: true,
    },
    secondName: {
      type: String,
      required: true,
    },
    thirdName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'User',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

TeacherSchema.plugin(softDeletePlugin);

export default mongoose.model<ITeacher, SoftDeleteModel<ITeacher>>('Teacher', TeacherSchema);

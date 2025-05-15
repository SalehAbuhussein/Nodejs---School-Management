import mongoose from 'mongoose';

import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';

export interface IStudent extends mongoose.Document {
  firstName: string;
  secondName: string;
  thirdName: string | null;
  lastName: string | null;
  studentTierId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
}

const StudentSchema = new mongoose.Schema<IStudent>(
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
    studentTierId: {
      type: mongoose.Types.ObjectId,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'User',
    },
  },
  { timestamps: true },
);

StudentSchema.plugin(softDeletePlugin);

export default mongoose.model<IStudent, SoftDeleteModel<IStudent>>('Student', StudentSchema);

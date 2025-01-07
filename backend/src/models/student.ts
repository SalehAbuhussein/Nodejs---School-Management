import mongoose from "mongoose"

export type IStudent = {
  firstName: string,
  secondName: string,
  thirdName: string | null,
  lastName: string | null,
  studentTierId: { type: mongoose.Types.ObjectId },
  enrollments: { type: mongoose.Types.ObjectId }[],
  userId: { type: mongoose.Types.ObjectId },
  isActive: boolean,
};

const StudentSchema = new mongoose.Schema<IStudent>({
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
    type: mongoose.Types.ObjectId
  },
  enrollments: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Enrollment',
    }
  ],
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model<IStudent>('Student', StudentSchema);
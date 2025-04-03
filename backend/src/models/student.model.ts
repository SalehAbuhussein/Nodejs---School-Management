import mongoose from "mongoose"

export type IStudent = {
  firstName: string,
  secondName: string,
  thirdName: string | null,
  lastName: string | null,
  studentTierId: mongoose.Schema.Types.ObjectId,
  enrollments: mongoose.Schema.Types.ObjectId[],
  userId: mongoose.Schema.Types.ObjectId,
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
    unique: true,
    ref: 'User',
  },
}, { timestamps: true });

export default mongoose.model<IStudent>('Student', StudentSchema);
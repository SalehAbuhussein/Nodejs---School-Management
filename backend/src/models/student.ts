import mongoose from "mongoose"

export type IStudent = {
  firstName: string,
  secondName: string,
  thirdName: string | null,
  lastName: string | null,
  isActive: boolean,
  studentTierId: { type: mongoose.Types.ObjectId },
  userId: { type: mongoose.Types.ObjectId }
}

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
  isActive: {
    type: Boolean,
    default: true,
  },
  studentTierId: {
    type: mongoose.Types.ObjectId
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, { timestamps: true });

export default mongoose.model<IStudent>('Student', StudentSchema);
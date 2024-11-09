import mongoose from "mongoose"

export type ITeacher = {
  firstName: string,
  secondName: string,
  thirdName: string | null,
  lastName: string,
  isActive: boolean,
  userId: { type: mongoose.Types.ObjectId },
};

const TeacherSchema = new mongoose.Schema<ITeacher>({
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
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

export default mongoose.model<ITeacher>('Teacher', TeacherSchema);
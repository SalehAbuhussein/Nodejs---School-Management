import mongoose from "mongoose"

export interface ITeacher {
  firstName: string,
  secondName: string,
  thirdName: string | null,
  lastName: string,
  isActive: boolean,
  userId: mongoose.Types.ObjectId,
  subjects: mongoose.Types.ObjectId[],
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'User',
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model<ITeacher>('Teacher', TeacherSchema);
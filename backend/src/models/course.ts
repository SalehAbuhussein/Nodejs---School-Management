import mongoose from "mongoose";

export type ICourse = {
  courseName: string,
  courseFees: number,
  isActive: boolean,
  teachers: mongoose.Types.ObjectId[],
};

const CourseSchema = new mongoose.Schema<ICourse>({
  courseName: {
    type: String,
    required: true,
  },
  courseFees: {
    type: Number,
    required: true,
  },
  teachers: [{
    type: mongoose.Types.ObjectId,
    ref: 'Teacher',
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model<ICourse>('Course', CourseSchema);
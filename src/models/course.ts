import mongoose from "mongoose";

export type ICourse = {
  courseName: string,
  courseFees: number,
  isActive: boolean,
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
  isActive: {
    type: Boolean,
    default: true,
  }
});

export default mongoose.model<ICourse>('Course', CourseSchema);
import mongoose from "mongoose";

export type ITeacherCourse = {
  teacherId: { type: mongoose.Types.ObjectId },
  courseId: { type: mongoose.Types.ObjectId },
};

const TeacherCourseSchema = new mongoose.Schema<ITeacherCourse>({
  courseId: { type: mongoose.Types.ObjectId, required: true, ref: 'Teacher' },
  teacherId: { type: mongoose.Types.ObjectId, required: true, ref: 'Course' },
});

export default mongoose.model('TeacherCourse', TeacherCourseSchema);
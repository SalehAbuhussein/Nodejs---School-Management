import mongoose from "mongoose"

export type IExam = {
  title: string,
  examTypeId: { type: mongoose.Types.ObjectId },
  studentId: { type: mongoose.Types.ObjectId },
  courseId: { type: mongoose.Types.ObjectId },
  fullExamGrade: number,
  studentGrade: number,
}

const ExamSchema = new mongoose.Schema<IExam>({
  title: {
    type: String,
    required: true,
  },
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  examTypeId: {
    type: mongoose.Types.ObjectId,
    ref: 'ExamType',
    required: true,
  },
  studentId: {
    type: mongoose.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  fullExamGrade: {
    type: Number,
    required: true,
  },
  studentGrade: {
    type: Number,
  },
}, { timestamps: true });

export default mongoose.model<IExam>('Exam', ExamSchema);
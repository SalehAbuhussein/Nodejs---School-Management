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
  },
  examTypeId: {
    type: mongoose.Types.ObjectId,
    ref: 'Exam',
  },
  studentId: {
    type: mongoose.Types.ObjectId,
    ref: 'Student',
  },
  fullExamGrade: {
    type: Number,
    required: true,
  },
  studentGrade: {
    type: Number,
  },
});

export default mongoose.model<IExam>('Exam', ExamSchema);
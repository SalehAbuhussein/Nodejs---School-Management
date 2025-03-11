import mongoose from "mongoose"

export type ITeacherExam = {
  title: string,
  fullExamGrade: number,
  examId: { type: mongoose.Types.ObjectId },
  examTypeId: { type: mongoose.Types.ObjectId },
  createdBy: { type: mongoose.Types.ObjectId },
}

const ExamSchema = new mongoose.Schema<ITeacherExam>({
  title: {
    type: String,
    required: true,
  },
  fullExamGrade: {
    type: Number,
  },
  examId: {
    type: mongoose.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  examTypeId: {
    type: mongoose.Types.ObjectId,
    ref: 'ExamType',
    required: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

export default mongoose.model<ITeacherExam>('TeacherExam', ExamSchema);
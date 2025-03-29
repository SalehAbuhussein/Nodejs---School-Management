import mongoose from "mongoose"

export type ITeacherExam = {
  title: string,
  fullExamGrade: number,
  examId: mongoose.Schema.Types.ObjectId,
  examTypeId: mongoose.Schema.Types.ObjectId,
  createdBy: mongoose.Schema.Types.ObjectId,
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
    ref: 'StudentExam',
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
import mongoose from "mongoose"

export type IStudentExam = {
  title: string,
  teacherExamId: { type: mongoose.Types.ObjectId },
  subjectId: { type: mongoose.Types.ObjectId },
  studentId: { type: mongoose.Types.ObjectId },
  studentGrade: number,
};

const ExamSchema = new mongoose.Schema<IStudentExam>({
  title: {
    type: String,
    required: true,
  },
  teacherExamId: {
    type: mongoose.Types.ObjectId,
    ref: 'TeacherExam',
    required: true,
  },
  subjectId: {
    type: mongoose.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  studentId: {
    type: mongoose.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  studentGrade: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model<IStudentExam>('Exam', ExamSchema);
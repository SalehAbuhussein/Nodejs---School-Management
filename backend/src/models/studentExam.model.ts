import mongoose, { Types } from "mongoose"

export type IStudentExam = {
  title: string,
  teacherExamId: mongoose.Types.ObjectId,
  subjectId: mongoose.Types.ObjectId,
  studentId: mongoose.Types.ObjectId,
  studentGrade: number,
};

export type ICreateStudentExam = {
  title: string;
  studentGrade: number;
  subjectId: string;
  studentId: string;
};

const ExamSchema = new mongoose.Schema<IStudentExam>({
  title: {
    type: String,
    required: true,
  },
  teacherExamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeacherExam',
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  studentGrade: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model<IStudentExam>('StudentExam', ExamSchema);
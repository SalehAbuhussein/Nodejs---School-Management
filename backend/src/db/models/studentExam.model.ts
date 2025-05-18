import mongoose from 'mongoose';

export interface IStudentExam extends mongoose.Document {
  title: string;
  teacherExamId: mongoose.Schema.Types.ObjectId;
  subjectId: mongoose.Schema.Types.ObjectId;
  studentId: mongoose.Schema.Types.ObjectId;
  studentGrade: number;
  semester: 'First' | 'Second';
  year: number;
}

export interface ICreateStudentExam {
  title: string;
  studentGrade: number;
  subjectId: string;
  studentId: string;
  semester: 'First' | 'Second';
  year: number;
}

const StudentExamSchema = new mongoose.Schema<IStudentExam>(
  {
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
    semester: {
      type: String,
      enum: ['First', 'Second'],
      default: 'First',
    },
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
  },
  { timestamps: true },
);

export default mongoose.model<IStudentExam>('StudentExam', StudentExamSchema);

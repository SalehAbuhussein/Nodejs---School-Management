import mongoose from 'mongoose';

export interface ITeacherExam {
  title: string;
  fullExamGrade: number;
  examTypeId: mongoose.Schema.Types.ObjectId;
  subjectId: mongoose.Schema.Types.ObjectId;
  createdBy: mongoose.Schema.Types.ObjectId;
}

const TeacherExamSchema = new mongoose.Schema<ITeacherExam>(
  {
    title: {
      type: String,
      required: true,
    },
    fullExamGrade: {
      type: Number,
    },
    examTypeId: {
      type: mongoose.Types.ObjectId,
      ref: 'ExamType',
      required: true,
    },
    subjectId: {
      type: mongoose.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export default mongoose.model<ITeacherExam>('TeacherExam', TeacherExamSchema);

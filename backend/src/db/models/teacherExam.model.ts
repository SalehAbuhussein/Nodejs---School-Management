import mongoose from 'mongoose';

import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';

export interface ITeacherExam extends mongoose.Document {
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

TeacherExamSchema.plugin(softDeletePlugin);

export default mongoose.model<ITeacherExam, SoftDeleteModel<ITeacherExam>>('TeacherExam', TeacherExamSchema);

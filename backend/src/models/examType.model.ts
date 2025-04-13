import mongoose from "mongoose";

export interface IExamType {
  name: string,
};

const ExamTypeSchema = new mongoose.Schema<IExamType>({
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IExamType>('ExamType', ExamTypeSchema);
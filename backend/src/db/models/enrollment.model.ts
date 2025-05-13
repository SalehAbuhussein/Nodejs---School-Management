import mongoose from 'mongoose';
import { softDeletePlugin, SoftDeleteModel } from 'soft-delete-plugin-mongoose';

export interface IEnrollment extends mongoose.Document {
  studentId: mongoose.Schema.Types.ObjectId;
  subjectId: mongoose.Schema.Types.ObjectId;
  enrollmentDate: Date;
  enrollmentFees: number;
  semester: 'First' | 'Second';
  year: number;
}

const EnrollmentSchema = new mongoose.Schema<IEnrollment>(
  {
    studentId: {
      type: mongoose.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    subjectId: {
      type: mongoose.Types.ObjectId,
      ref: 'Subject',
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
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    enrollmentFees: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

EnrollmentSchema.plugin(softDeletePlugin);

export default mongoose.model<IEnrollment, SoftDeleteModel<IEnrollment>>('Enrollment', EnrollmentSchema);

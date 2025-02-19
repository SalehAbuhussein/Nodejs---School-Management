import mongoose from "mongoose";
import { softDeletePlugin, SoftDeleteModel } from 'soft-delete-plugin-mongoose';

export interface IEnrollment extends mongoose.Document {
  studentId: { type: mongoose.Types.ObjectId },
  courseId: { type: mongoose.Types.ObjectId },
  enrollmentDate: Date,
  enrollmentFees: number,
  semester: 'First' | 'Second',
  year: number,
};

const EnrollmentSchema = new mongoose.Schema<IEnrollment>({
  studentId: {
    type: mongoose.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: 'Course',
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
}, { timestamps: true });

EnrollmentSchema.plugin(softDeletePlugin);

export default mongoose.model<IEnrollment, SoftDeleteModel<IEnrollment>>('Enrollment', EnrollmentSchema);
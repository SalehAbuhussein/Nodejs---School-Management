import mongoose from "mongoose";

export type IEnrollment = {
  studentId: { type: mongoose.Types.ObjectId },
  courseId: { type: mongoose.Types.ObjectId },
  enrollmentDate: Date,
  enrollmentFees: number,
  isActive: boolean,
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
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
  enrollmentFees: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

export default mongoose.model('Enrollment', EnrollmentSchema);
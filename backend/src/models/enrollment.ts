import mongoose from "mongoose";

export type IEnrollment = {
  studentId: { type: mongoose.Types.ObjectId },
  courseId: { type: mongoose.Types.ObjectId },
  enrollmentDate: Date,
  enrollmentFees: number,
  isActive: boolean,
  createdBy: { type: mongoose.Types.ObjectId },
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
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
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
import mongoose from "mongoose";

export type IEnrollment = {
  studentId: { type: mongoose.Types.ObjectId },
  courseId: { type: mongoose.Types.ObjectId },
  enrollmentDate: Date,
  enrollmentFees: number,
};

const EnrollmentSchema = new mongoose.Schema<IEnrollment>({
  studentId: {
    type: mongoose.Types.ObjectId,
    ref: 'Student'
  },
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: 'Course',
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
  enrollmentFees: {
    type: Number,
    required: true
  }
});

export default mongoose.model('Enrollment', EnrollmentSchema);
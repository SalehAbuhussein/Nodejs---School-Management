import mongoose from 'mongoose';
import { softDeletePlugin, SoftDeleteModel } from 'soft-delete-plugin-mongoose';

export interface ITeacherSubject extends mongoose.Document {
  teacherId: mongoose.Schema.Types.ObjectId;
  subjectId: mongoose.Schema.Types.ObjectId;
  assignedDate: Date;
  semester: 'First' | 'Second';
  isActive: boolean;
}

export interface AssignTeacherParams {
  teacherId: string;
  subjectId: string;
  semester: 'First' | 'Second';
  assignedDate?: Date;
}

const TeacherSubjectSchema = new mongoose.Schema<ITeacherSubject>(
  {
    teacherId: {
      type: mongoose.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    subjectId: {
      type: mongoose.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    assignedDate: {
      type: Date,
      default: Date.now,
    },
    semester: {
      type: String,
      enum: ['First', 'Second'],
      required: true,
      default: 'First',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Add indexes optimized for your search patterns
TeacherSubjectSchema.index({ subjectId: 1 });
TeacherSubjectSchema.index({ teacherId: 1, assignedDate: 1 });
TeacherSubjectSchema.index({ teacherId: 1, semester: 1 });
TeacherSubjectSchema.index({ teacherId: 1, subjectId: 1, semester: 1, isDeleted: 1 });

// Helper method to get the academic year from assignedDate
TeacherSubjectSchema.virtual('academicYear').get(function() {
  const date = this.assignedDate;
  // Academic year typically spans two calendar years
  // If date is in second half of year (e.g., after July), it's the start of academic year
  // Otherwise it's in the second half of the academic year
  const month = date.getMonth();
  const year = date.getFullYear();
  
  if (month >= 6) { // After June
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
});

TeacherSubjectSchema.plugin(softDeletePlugin);

export default mongoose.model<ITeacherSubject, SoftDeleteModel<ITeacherSubject>>('TeacherSubject', TeacherSubjectSchema);
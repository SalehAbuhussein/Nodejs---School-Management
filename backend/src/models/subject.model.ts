import mongoose from "mongoose";

export type ISubject = {
  name: string,
  teachers: mongoose.Types.ObjectId[],
  enrollments: mongoose.Types.ObjectId[],
  totalSlots: number,
  currentSlots: number,
  isActive: boolean,
  isLocked: boolean,
};

const SubjectSchema = new mongoose.Schema<ISubject>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  teachers: [{
    type: mongoose.Types.ObjectId,
    ref: 'Teacher',
  }],
  enrollments: [{
    type: mongoose.Types.ObjectId,
    ref: 'Enrollment',
  }],
  totalSlots: {
    type: Number,
    required: true,
  },
  currentSlots: {
    type: Number,
    default: 0,
    validate: {
      validator: function(this, currentSlots: number) {
        return currentSlots <= this.totalSlots;
      },
      message: 'Current slots cannot exceed total slots.',
    },
  },
  isLocked: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model<ISubject>('Subject', SubjectSchema);
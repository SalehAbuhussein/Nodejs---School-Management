import mongoose from "mongoose";

export type ICourse = {
  courseName: string,
  courseFees: number,
  teachers: mongoose.Types.ObjectId[],
  totalSlots: number,
  currentSlots: number,
  isActive: boolean,
  isLocked: boolean,
};

const CourseSchema = new mongoose.Schema<ICourse>({
  courseName: {
    type: String,
    required: true,
  },
  courseFees: {
    type: Number,
    required: true,
  },
  teachers: [{
    type: mongoose.Types.ObjectId,
    ref: 'Teacher',
  }],
  totalSlots: [{
    type: Number,
    required: true,
  }],
  currentSlots: [{
    type: Number,
    default: 0,
    validate: {
      validator: function(this, currentSlots: number) {
        return currentSlots <= this.totalSlots;
      },
      message: 'Current slots cannot exceed total slots.',
    },
  }],
  isLocked: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model<ICourse>('Course', CourseSchema);
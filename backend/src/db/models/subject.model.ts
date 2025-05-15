import mongoose from 'mongoose';

export interface ISubject {
  name: string;
  totalSlots: number;
  currentSlots: number;
  isActive: boolean;
  isLocked: boolean;
}

const SubjectSchema = new mongoose.Schema<ISubject>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    totalSlots: {
      type: Number,
      required: true,
    },
    currentSlots: {
      type: Number,
      default: 0,
      validate: {
        validator: function (this, currentSlots: number) {
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
  },
  { timestamps: true },
);

export default mongoose.model<ISubject>('Subject', SubjectSchema);

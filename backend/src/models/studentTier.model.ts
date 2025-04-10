import mongoose from "mongoose";

export interface IStudentTier extends mongoose.Document {
  tierName: string,
  monthlySubscriptionFees: number,
};

const StudentTierSchema = new mongoose.Schema<IStudentTier>({
  tierName: {
    type: String,
    required: true,
  },
  monthlySubscriptionFees: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<IStudentTier>('StudentTier', StudentTierSchema);
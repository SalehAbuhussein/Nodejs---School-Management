import mongoose from 'mongoose';

export interface IRefreshToken {
  token: string;
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const refreshTokenSchema = new mongoose.Schema<IRefreshToken>(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// This will remove the token after 7 days
refreshTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 }); // 7 Days
export default mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);

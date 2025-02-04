import mongoose from 'mongoose';

export interface IUser {
  name: string,
  email: string,
  profileImg?: string,
  password: string,
  role: mongoose.Types.ObjectId,
};

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  profileImg: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
import mongoose from 'mongoose';

export interface IUser {
  name: string,
  email: string,
  profileImg: string,
  password: string,
  personId: { type: mongoose.Types.ObjectId }
}

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
  personId: {
    type: mongoose.Types.ObjectId,
    ref: 'Person',
  },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
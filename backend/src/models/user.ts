import mongoose from 'mongoose';

export interface IUser {
  name: string,
  username: string,
  email: string,
  profileImg: string,
  password: string,
  personId: { type: mongoose.Types.ObjectId }
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
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
});

export default mongoose.model<IUser>('User', UserSchema);
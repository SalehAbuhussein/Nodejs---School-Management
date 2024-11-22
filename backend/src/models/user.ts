import mongoose from 'mongoose';

export interface IUser {
  name: string,
  username: string,
  email: string,
  profileImg: string,
  password: string,
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
  }
});

export default mongoose.model<IUser>('User', UserSchema);
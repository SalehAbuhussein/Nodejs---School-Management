import mongoose from 'mongoose';

export interface IRole {
  roleName: string;
  permissions: mongoose.Schema.Types.ObjectId[];
  users: mongoose.Schema.Types.ObjectId[];
}

const RoleSchema = new mongoose.Schema<IRole>(
  {
    roleName: {
      type: String,
      required: true,
      unique: true,
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
        required: true,
      },
    ],
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model<IRole>('Role', RoleSchema);

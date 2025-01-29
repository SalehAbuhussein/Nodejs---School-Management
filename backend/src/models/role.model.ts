import mongoose, { Schema } from "mongoose"

export interface IRole {
  roleName: string,
  permissions: mongoose.ObjectId[],
};

const RoleSchema = new mongoose.Schema<IRole>({
  roleName: {
    type: String,
    required: true,
  },
  permissions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Permission',
      required: true,
    }
  ],
}, { timestamps: true });

export default mongoose.model<IRole>('Role', RoleSchema);
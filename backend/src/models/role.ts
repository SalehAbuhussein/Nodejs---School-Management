import mongoose from "mongoose"

export interface IRole {
  roleName: string,
  permissions: string[],
};

const RoleSchema = new mongoose.Schema<IRole>({
  roleName: {
    type: String,
    required: true,
  },
  permissions: {
    type: [String],
    required: true,
  },
}, { timestamps: true });

export default mongoose.model<IRole>('Role', RoleSchema);
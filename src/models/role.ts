import mongoose from "mongoose"

export interface IRole {
  name: string
};

const RoleSchema = new mongoose.Schema<IRole>({
  name: {
    type: String,
    required: true,
  }
});

export default mongoose.model<IRole>('Role', RoleSchema);
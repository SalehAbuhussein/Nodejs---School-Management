import mongoose from "mongoose";

export interface IPermission extends mongoose.Document {
  name: string,
};

const PermissionSchema = new mongoose.Schema<IPermission>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model<IPermission>('Permission', PermissionSchema);
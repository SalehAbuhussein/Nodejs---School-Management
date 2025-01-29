import mongoose from "mongoose";

export interface IPermission {
  name: string,
};

const PermissionSchema = new mongoose.Schema<IPermission>({
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IPermission>('Permission', PermissionSchema);
import mongoose from 'mongoose';

export interface IPermission extends mongoose.Document {
  name: string;
  description: string;
}

const PermissionSchema = new mongoose.Schema<IPermission>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IPermission>('Permission', PermissionSchema);

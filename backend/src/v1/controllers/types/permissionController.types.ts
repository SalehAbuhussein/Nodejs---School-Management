import { IPermission } from 'src/db/models/permission.model';

export type GetPermissionParams = { permissionId: string };

export type PostPermissionBody = { name: string; description: string };

export type UpdatePermissionBody = PostPermissionBody;

export type UpdatePermissionParams = { permissionId: string };

export type DeletePermissionParams = { permissionId: string };

export type GetPermissionResponse = {
  status: number;
  data: IPermission | null;
  message: string;
  error?: any;
};

export type CreatePermissionResponse = {
  status: number;
  data: IPermission | null;
  message: string;
  error?: any;
};

export type UpdatePermissionResponse = {
  status: number;
  data: IPermission | null;
  message: string;
  error?: any;
};

export type DeletePermissionResponse = {
  status: number;
  message: string;
  data: IPermission | null;
  error?: any;
};

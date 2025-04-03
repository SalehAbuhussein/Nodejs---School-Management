import { IPermission } from "src/models/permission.model";

export type GetPermissionParams = { permissionId: string };

export type PostPermissionBody = { name: string };

export type UpdatePermissionBody = PostPermissionBody;

export type UpdatePermissionParams = { permissionId: string };

export type DeletePermissionParams = { permissionId: string };

export type GetPermissionsResponse = {
  status: number,
  data: IPermission[] | null,
  message: string,
  error?: any,
};

export type GetPermissionResponse = {
  status: number,
  data: IPermission | null,
  message: string,
  error?: any,
};

export type CreatePermissionResponse = {
  status: number,
  data: IPermission | null,
  message: string,
  error?: any,
};

export type UpdatePermissionResponse = {
  status: number,
  data: IPermission | null,
  message: string,
  error?: any,
};

export type DeletePermissionResponse = {
  status: number,
  message: string,
  data: IPermission | null,
  error?: any,
};
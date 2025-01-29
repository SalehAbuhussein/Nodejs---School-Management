import mongoose from "mongoose";
import { IRole } from "src/models/role.model";

export type GetRoleParams = { roleId: string };

export type PostRoleBody = { roleName: string, permissions: string[] };

export type UpdateRoleBody = PostRoleBody;

export type UpdateRoleParams = { roleId: string };

export type DeleteRoleParams = { roleId: string };

export type GetRolesResponse = {
  status: number,
  data: IRole[] | null,
  message: string,
  error?: any,
};

export type GetRoleResponse = {
  status: number,
  data: IRole | null,
  message: string,
  error?: any,
};

export type CreateRoleResponse = {
  status: number,
  data: IRole | null,
  message: string,
  error?: any,
};

export type UpdateRoleResponse = {
  status: number,
  data: IRole | null,
  message: string,
  error?: any,
};

export type DeleteRoleResponse = {
  status: number,
  message: string,
  error?: any,
};
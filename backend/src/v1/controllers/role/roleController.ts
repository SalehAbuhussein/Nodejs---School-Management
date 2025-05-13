import { NextFunction, Request, Response } from 'express';

import mongoose from 'mongoose';

import * as RoleService from 'src/v1/services/roleService';

import { GetRoleParams, PostRoleBody, UpdateRoleResponse, GetRoleResponse, CreateRoleResponse, DeleteRoleResponse, UpdateRoleParams, UpdateRoleBody, DeleteRoleParams } from 'src/v1/controllers/types/roleController.types';

/**
 * Get role
 *
 * @param { Request } req
 * @param { Response<GetRoleResponse> } res
 * @param { NextFunction } next
 */
export const getRole = async (req: Request, res: Response<GetRoleResponse>, next: NextFunction) => {
  try {
    const { roleId }: GetRoleParams = req.params as GetRoleParams;
    const role = await RoleService.getRole(roleId);

    return res.json({
      status: 200,
      data: role,
      message: 'Role fetched successfully!',
    });
  } catch (error: any) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
      data: null,
      error: error.originalError,
    });
  }
};

/**
 * Create role
 *
 * @param { Request } req
 * @param { Response<CreateRoleResponse> } res
 * @param { NextFunction } next
 */
export const createRole = async (req: Request, res: Response<CreateRoleResponse>, next: NextFunction) => {
  try {
    const { roleName, permissions, users }: PostRoleBody = req.body;

    const newRole = await RoleService.createRole({ roleName, permissions, users });

    return res.status(201).json({
      status: 201,
      data: newRole,
      message: 'Role created successfully!',
    });
  } catch (error: any) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
      data: null,
      error: error.originalError,
    });
  }
};

/**
 * Update role
 *
 * @param { Request } req
 * @param { Response<UpdateRoleResponse> } res
 * @param { NextFunction } next
 */
export const updateRole = async (req: Request, res: Response<UpdateRoleResponse>, next: NextFunction) => {
  try {
    const { permissions, roleName, users }: UpdateRoleBody = req.body;
    const { roleId }: UpdateRoleParams = req.params as UpdateRoleParams;

    const role = await RoleService.updateRole(roleId, { roleName, permissions, users });

    return res.json({
      status: 200,
      data: role,
      message: 'Role Updated Successfully!',
    });
  } catch (error: any) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
      data: null,
      error: error.originalError,
    });
  }
};

// TODO: You need to handle reseting user who have specific role to default them to some role

/**
 * Get role
 *
 * @param { Request } req
 * @param { Response<DeleteRoleResponse> } res
 * @param { NextFunction } next
 */
export const deleteRole = async (req: Request, res: Response<DeleteRoleResponse>, next: NextFunction) => {
  try {
    const { roleId }: DeleteRoleParams = req.params as DeleteRoleParams;

    await RoleService.deleteRole(roleId);

    return res.json({
      status: 200,
      message: 'Role Deleted Successfully!',
      data: null,
    });
  } catch (error: any) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
      data: null,
      error: error.originalError,
    });
  }
};

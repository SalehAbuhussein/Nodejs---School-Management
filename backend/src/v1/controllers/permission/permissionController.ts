import { NextFunction, Request, Response } from 'express';

import * as PermissionService from 'src/v1/services/permissionService';

import { DeletePermissionParams, GetPermissionParams, PostPermissionBody, UpdatePermissionBody, UpdatePermissionParams, CreatePermissionResponse, DeletePermissionResponse, GetPermissionResponse, UpdatePermissionResponse } from 'src/v1/controllers/types/permissionController.types';

/**
 * Get Permission
 *
 * @param { Request } req
 * @param { Response<GetPermissionResponse> } res
 * @param { NextFunction } next
 */
export const getPermission = async (req: Request, res: Response<GetPermissionResponse>, next: NextFunction) => {
  try {
    const { permissionId }: GetPermissionParams = req.params as GetPermissionParams;

    const permission = await PermissionService.getPermission(permissionId);

    return res.json({
      status: 200,
      data: permission,
      message: 'Permission Fetched Successfully!',
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
 * Create Permission
 *
 * @param { Request } req
 * @param { Response<CreatePermissionResponse> } res
 * @param { NextFunction } next
 */
export const createPermission = async (req: Request, res: Response<CreatePermissionResponse>, next: NextFunction) => {
  try {
    const { name, description }: PostPermissionBody = req.body;
    const permission = await PermissionService.createPermission({ name, description });

    return res.status(201).json({
      status: 201,
      data: permission,
      message: 'Permission Created Successfully',
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
 * Update Permission
 *
 * @param { Request } req
 * @param { Response<UpdatePermissionResponse> } res
 * @param { NextFunction } next
 */
export const updatePermission = async (req: Request, res: Response<UpdatePermissionResponse>, next: NextFunction) => {
  try {
    const { name, description }: UpdatePermissionBody = req.body;
    const { permissionId }: UpdatePermissionParams = req.params as UpdatePermissionParams;
    const permission = await PermissionService.updatePermission(permissionId, { name, description });

    return res.json({
      status: 200,
      data: permission,
      message: 'Permission Updated Successfully!',
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
 * Delete Permission
 *
 * @param { Request } req
 * @param { Response<DeletePermissionResponse> } res
 * @param { NextFunction } next
 */
export const deletePermission = async (req: Request, res: Response<DeletePermissionResponse>, next: NextFunction) => {
  try {
    const { permissionId }: DeletePermissionParams = req.params as DeletePermissionParams;
    await PermissionService.deletePermission(permissionId);

    return res.json({
      status: 200,
      message: 'Permission Deleted Successfully!',
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

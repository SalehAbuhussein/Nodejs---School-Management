import { NextFunction, Request, Response } from "express";
import { HydratedDocument } from "mongoose";

import Permission, { IPermission } from "src/models/permission.model";

import { 
  CreatePermissionResponse, 
  DeletePermissionParams, 
  DeletePermissionResponse, 
  GetPermissionParams, 
  GetPermissionResponse, 
  GetPermissionsResponse, 
  PostPermissionBody, 
  UpdatePermissionBody, 
  UpdatePermissionParams, 
  UpdatePermissionResponse 
} from "src/shared/types/permissionController.types";

/**
 * Get list of Permissions
 * 
 * @param { Request } req 
 * @param { Response<GetPermissionsResponse> } res 
 * @param { NextFunction } next 
 */
export const getPermissions = async (req: Request, res: Response<GetPermissionsResponse>, next: NextFunction) => {
  try {
    const permissions = await Permission.find();

    return res.json({ 
      status: 200,
      data: permissions,
      message: 'Permissions Fetched Successfully!',
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      data: null,
      message: 'Server Error',
      error: error,
    });
  }
};

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

    const permission = await Permission.findById(permissionId);
    
    if (!permission) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Not Found!',
      });
    }

    return res.json({ 
      status: 200, 
      data: permission, 
      message: 'Permission Fetched Successfully!' 
    });
  } catch (error) {
    return res.status(500).json({ 
      status: 200,
      data: null,
      message: 'Server Error',
      error: error, 
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
    const { name }: PostPermissionBody = req.body;

    const newPermission: HydratedDocument<IPermission> = await new Permission({ name }).save();

    return res.status(201).json({ 
      status: 201,
      data: newPermission,
      message: "Permission Created Successfully"
    });
  } catch (error) {
    return res.status(500).json({ 
      status: 500, 
      data: null, 
      message: "Server error" 
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
export const UpdatePermission = async (req: Request, res: Response<UpdatePermissionResponse>, next: NextFunction) => {
  try {
    const { name }: UpdatePermissionBody = req.body;
    const { permissionId }: UpdatePermissionParams = req.params as UpdatePermissionParams;

    let permission = await Permission.findById(permissionId);
    
    if (!permission) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Not Found!', 
      });
    }

    if (permission.name && name) {
      permission.name = name;
    }

    permission = await permission.save();

    return res.json({
      status: 200,
      data: permission,
      message: 'Permission Updated Successfully!',
    })
  } catch (error) {
    return res.status(500).json({
      status: 500,
      data: null, 
      message: 'Server Error', 
      error: error, 
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
      
      const permission = await Permission.findById(permissionId);
  
      if (!permission) {
        return res.status(404).json({
          status: 404,
          message: 'Not Found!',
        });
      }
  
      await permission?.deleteOne();
  
      return res.json({ 
        status: 200,
        message: 'Permission Deleted Successfully!',
       });
    } catch (error) {
      return res.status(500).json({ 
        status: 500, 
        message: 'Server Error', 
        error: error
       });
    }
};
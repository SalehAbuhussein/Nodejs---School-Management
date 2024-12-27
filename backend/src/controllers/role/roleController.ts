import { NextFunction, Request, Response } from "express";

import Role from "src/models/role";

import { 
  GetRoleParams, 
  PostRoleBody, 
  UpdateRoleResponse,
  GetRoleResponse, 
  GetRolesResponse,
  CreateRoleResponse, 
  DeleteRoleResponse,
  UpdateRoleParams,
  UpdateRoleBody,
  DeleteRoleParams,
 } from "src/shared/types/roleController.types";

/**
 * Get roles
 * 
 * @param { Request } req 
 * @param { Response<GetRolesResponse> } res 
 * @param { NextFunction } next 
 */
export const getRoles = async (req: Request, res: Response<GetRolesResponse>, next: NextFunction) => {
  try {
    const roles = await Role.find();

    return res.json({
      status: 200,
      data: roles,
      message: 'Roles Fetched Successfully!',
    })
  } catch (error) {
    return res.status(500).json({
      status: 500,
      data: null,
      message: 'Server Error',
      error: error,
    });
  };
};

/**
 * Get role
 * 
 * @param { Request } req 
 * @param { Response<GetRoleResponse> } res 
 * @param { NextFunction } next 
 */
export const getRole = async (req: Request, res: Response<GetRoleResponse>, next: NextFunction) => {
  const { roleId }: GetRoleParams = req.params as GetRoleParams;

  try {
    const role = await Role.findById({ _id: roleId });

    if (!role) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Role not found!',
      });
    }

    return res.json({
      status: 200,
      data: role,
      message: 'Role fetched successfully!',
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      data: null,
      message: 'Server Error',
      error: error,
    })
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
  const { roleName, permissions }: PostRoleBody = req.body;

  const newRole = new Role({
    roleName,
    permissions,
  });

  try {
    const role = await newRole.save();

    return res.status(201).json({
      status: 201,
      data: role,
      message: 'Role created successfully!'
    })
  } catch (error) {
    return res.status(500).json({
      status: 500,
      data: null,
      message: 'Server Error',
    });
  }
};

/**
 * Get role
 * 
 * @param { Request } req 
 * @param { Response<UpdateRoleResponse> } res 
 * @param { NextFunction } next 
 */
export const updateRole = async (req: Request, res: Response<UpdateRoleResponse>, next: NextFunction) => {
  const { permissions, roleName }: UpdateRoleBody = req.body;
  const { roleId }: UpdateRoleParams = req.params as UpdateRoleParams;

  try {
    let role = await Role.findById(roleId);

    if (!role) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Role not found!',
      })
    }

    if (role.roleName && roleName) {
      role.roleName = roleName;
    }

    if (role.permissions && permissions.length > 0) {
      role.permissions = permissions;
    }

    role = await role.save();

    return res.json({
      status: 200,
      data: role,
      message: 'Role Updated Successfully!',
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

// TODO: You need to handle reseting user who have specific role to default them to some role

/**
 * Get role
 * 
 * @param { Request } req 
 * @param { Response<DeleteRoleResponse> } res 
 * @param { NextFunction } next 
 */
export const deleteRole = async (req: Request, res: Response<DeleteRoleResponse>, next: NextFunction) => {
  const { roleId }: DeleteRoleParams = req.params as DeleteRoleParams;

  try {
    const role = Role.findById(roleId);

    if (!role) {
      return res.status(404).json({
        status: 404,
        message: 'Role not found!',
      });
    }

    await role.deleteOne();

    return res.json({
      status: 200,
      message: 'Role Deleted Successfully!',
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Server Error',
      error: error,
    });
  }
};
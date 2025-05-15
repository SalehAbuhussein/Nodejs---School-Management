import Permission, { IPermission } from 'src/db/models/permission.model';

import { PostPermissionBody, UpdatePermissionBody } from '../controllers/types/permissionController.types';

import { CustomError } from 'src/shared/utils/CustomError';
import { ClientSession } from 'mongoose';

/**
 * Retrieve all permissions from the database
 *
 * @returns {Promise<IPermission[]>} A promise that resolves to an array of permissions
 * @throws {CustomError} If database operation fails
 */
export const getAllPermissions = async (): Promise<IPermission[]> => {
  try {
    return await Permission.find();
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to retrieve permissions', 500);
  }
};

/**
 * Retrieve a specific permission by ID
 *
 * @param {string} permissionId - The ID of the permission to retrieve
 * @returns {Promise<IPermission>} A promise that resolves to the permission
 * @throws {CustomError} If permission not found or database operation fails
 */
export const getPermissionById = async (permissionId: string, session?: ClientSession): Promise<IPermission | null> => {
  try {
    if (session) {
      return await Permission.findOne({ _id: permissionId }, {}, { session });
    }

    return await Permission.findById(permissionId);
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to retrieve permission', 500);
  }
};

/**
 * Retrieve a specific permission by name
 *
 * @param {string} permissionId - The ID of the permission to retrieve
 * @returns {Promise<IPermission>} A promise that resolves to the permission
 * @throws {CustomError} If permission not found or database operation fails
 */
export const getPermissionByName = async (name: string, session?: ClientSession): Promise<IPermission | null> => {
  try {
    if (session) {
      return await Permission.findOne({ name }, {}, { session });
    }

    return await Permission.findOne({ name });
  } catch (error) {
        if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to retrieve permission', 500);
  }
};

/**
 * Create a new permission
 *
 * @param {PostPermissionBody} permissionData - The name of the permission to create
 * @returns {Promise<IPermission>} A promise that resolves to the created permission
 * @throws {CustomError} If validation fails or database operation fails
 */
export const createPermission = async (permissionData: PostPermissionBody): Promise<IPermission> => {
  try {
    const existingPermission = await getPermissionByName(permissionData.name);
    if (existingPermission) {
      throw new CustomError('Permission already exists', 400);
    }

    const newPermission = await Permission.create(permissionData);
    return newPermission;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to create permission', 500);
  }
};

/**
 * Update an existing permission
 *
 * @param {string} permissionId - The ID of the permission to update
 * @param {UpdatePermissionBody} permissionData - The updated permission data
 * @returns {Promise<IPermission>} A promise that resolves to the updated permission
 * @throws {CustomError} If permission not found or database operation fails
 */
export const updatePermission = async (permissionId: string, permissionData: UpdatePermissionBody): Promise<IPermission> => {
  try {
    const permission = await Permission.findById(permissionId);
    if (!permission) {
      throw new CustomError('Permission not found', 404);
    }

    if (permissionData.name !== undefined && permissionData.name !== permission.name) {
      const existingPermission = await Permission.findOne({ name: permissionData.name });
      if (existingPermission) {
        throw new CustomError(`Permission with name "${permissionData.name}" already exists`, 400);
      }
      permission.name = permissionData.name;
    }

    return await permission.save();
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to update permission', 500);
  }
};

/**
 * Delete a permission
 *
 * @param {string} permissionId - The ID of the permission to delete
 * @returns {Promise<boolean>} A promise that resolves to true if deletion was successful
 * @throws {CustomError} If permission not found or database operation fails
 */
export const deletePermission = async (permissionId: string): Promise<boolean> => {
  try {
    const result = await Permission.deleteOne({ _id: permissionId });
    return result.deletedCount > 0;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to delete permission', 500);
  }
};

/**
 * Check if a permission exists
 *
 * @param {string} permissionId - The ID of the permission to check
 * @returns {Promise<boolean>} A promise that resolves to true if the permission exists
 * @throws {CustomError} If database operation fails
 */
export const checkPermissionExists = async (permissionId: string): Promise<boolean> => {
  try {
    const count = await Permission.countDocuments({ _id: permissionId });
    return count > 0;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to check if permission exists', 500, error);
  }
};

/**
 * Check if multiple permissions exist
 *
 * @param {string[]} permissionIds - Array of permission IDs to check
 * @returns {Promise<boolean>} A promise that resolves to true if all permissions exist
 * @throws {CustomError} If any permission doesn't exist or database operation fails
 */
export const checkPermissionsExist = async (permissionIds: string[]): Promise<boolean> => {
  try {
    const permissions = await Permission.find({ _id: { $in: permissionIds } });
    return permissions.length !== permissionIds.length;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to check permissions', 500, error);
  }
};

export default {
  getAllPermissions,
  getPermission: getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
  permissionExists: checkPermissionExists,
  checkPermissionsExist,
};

import Permission, { IPermission } from 'src/models/permission.model';

import { CustomError } from 'src/shared/utils/CustomError';

export class PermissionService {

  /**
   * Retrieve all permissions from the database
   * 
   * @returns {Promise<IPermission[]>} A promise that resolves to an array of permissions
   * @throws {CustomError} If database operation fails
   */
  static getAllPermissions = async (): Promise<IPermission[]> => {
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
  static getPermission = async (permissionId: string): Promise<IPermission> => {
    try {
      const permission = await Permission.findById(permissionId);

      if (!permission) {
        throw new CustomError('Permission not found', 404);
      }

      return permission;
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
   * @param {IPermission} permissionData - The name of the permission to create
   * @returns {Promise<IPermission>} A promise that resolves to the created permission
   * @throws {CustomError} If validation fails or database operation fails
   */
  static createPermission = async (permissionData: IPermission): Promise<IPermission> => {
    try {
      const existingPermission = await Permission.findOne({ name: permissionData.name });

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
   * @param {IPermission} permissionData - The updated permission data
   * @returns {Promise<IPermission>} A promise that resolves to the updated permission
   * @throws {CustomError} If permission not found or database operation fails
   */
  static updatePermission = async (permissionId: string, permissionData: IPermission): Promise<IPermission> => {
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
    } catch(error) {
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
  static deletePermission = async (permissionId: string): Promise<boolean> => {
    try {
      const result = await Permission.deleteOne({ _id: permissionId });

      if (result.deletedCount === 0) {
        throw new CustomError('Permission not found', 404);
      }

      return result.deletedCount > 0;
    } catch(error) {
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
  static permissionExists = async (permissionId: string): Promise<boolean> => {
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
  static checkPermissionsExist = async (permissionIds: string[]): Promise<boolean> => {
    try {
      const permissions = await Permission.find({ _id: { $in: permissionIds } });
      
      if (permissions.length !== permissionIds.length) {
        throw new CustomError('One or more permissions do not exist', 404);
      }
      
      return true;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Failed to check permissions', 500, error);
    }
  };
}
import Permission, { IPermission } from 'src/models/permission.model';
import { CustomError } from 'src/shared/utils/CustomError';

export class PermissionService {

  /**
   * Get all permissions
   * @throws CustomError if database operation fails
   */
  static getAllPermissions = async () => {
    try {
      return await Permission.find();
    } catch (error) {
      throw new CustomError('Failed to retrieve permissions', 500);
    }
  };

  /**
   * Get permission by ID
   * @param permissionId - The ID of the permission to retrieve
   * @throws CustomError if permission not found or database operation fails
   */
  static getPermission = async (permissionId: string) => {
    try {
      const permission = await Permission.findById(permissionId);

      if (!permission) {
        throw new CustomError('Permission not found', 404);
      }

      return permission;
    } catch (error) {
      throw new CustomError('Failed to retrieve permission', 500);
    }
  };

  /**
   * Create a new permission
   * @param name - The name of the permission
   * @throws CustomError if validation fails or database operation fails
   */
  static createPermission = async (permissionData: IPermission) => {
    try {
      const existingPermission = await Permission.findOne({ name: permissionData.name });

      if (existingPermission) {
        throw new CustomError('Permission already exists', 400);
      }

      const newPermission = await Permission.create(permissionData);
      return newPermission;
    } catch (error) {
      throw new CustomError('Failed to create permission', 500);
    }
  };

  /**
   * Update an existing permission
   * @param permissionId - The ID of the permission to update
   * @param permissionData - The data to update
   * @throws CustomError if permission not found or database operation fails
   */
  static updatePermission = async (permissionId: string, permissionData: IPermission) => {
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
      throw new CustomError('Failed to update permission', 500);
    }
  };

  /**
   * Delete a permission
   * @param permissionId - The ID of the permission to delete
   * @throws CustomError if permission not found or database operation fails
   */
  static deletePermission = async (permissionId: string) => {
    try {
      const result = await Permission.deleteOne({ _id: permissionId });

      if (result.deletedCount === 0) {
        throw new CustomError('Permission not found', 404);
      }

      return result.deletedCount > 0;
    } catch(error) {
      throw new CustomError('Failed to delete permission', 500);
    }
  };
  
  /**
   * Check if a permission exists
   * @param permissionId - The ID of the permission to check
   * @throws CustomError if database operation fails
   */
  static permissionExists = async (permissionId: string) => {
    try {
      const count = await Permission.countDocuments({ _id: permissionId });
      return count > 0;
    } catch (error) {
      throw new CustomError('Failed to check if permission exists', 500, error);
    }
  };

  /**
   * Check if multiple permissions exist
   * @param permissionIds - Array of permission IDs to check
   * @throws CustomError if any permission doesn't exist or database operation fails
   */
  static checkPermissionsExist = async (permissionIds: string[]) => {
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
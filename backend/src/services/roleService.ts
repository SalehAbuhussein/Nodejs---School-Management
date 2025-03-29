import mongoose from 'mongoose';
import Role, { IRole } from 'src/models/role.model';

import { CustomError } from 'src/shared/utils/CustomError';

export class RoleService {
  /**
   * Get all roles
   * @throws CustomError if database operation fails
   */
  static getAllRoles = async () => {
    try {
      return await Role.find();
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Failed to retrieve roles', 500, error);
    }
  };

  /**
   * Get role by ID
   * @param roleId - The ID of the role to retrieve
   * @throws CustomError if role not found or database operation fails
   */ 
  static getRole = async (roleId: string) => {
    try {
      const role = await Role.findById(roleId);

      if (!role) {
        throw new CustomError('Role not found', 404);
      }

      return role;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Failed to retrieve role', 500, error);
    }
  };

  /**
   * Create a new role
   * @param roleData - The role data to create
   * @throws CustomError if validation fails or database operation fails
   */
  static createRole = async (roleData: IRole) => {
    try {
      const existingRole = await Role.findOne({ name: roleData.roleName });

      if (existingRole) {
        throw new CustomError('Role already exists', 400);
      }

      return Role.create(roleData);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw new CustomError('Failed to create role', 500, error);  
    }
  };

  /**
   * Update an existing role
   * @param roleId - The ID of the role to update
   * @param roleData - The data to update
   * @throws CustomError if role not found or database operation fails
   */
  static updateRole = async (roleId: string, roleData: Partial<IRole>) => {
    try {
      const role = await Role.findById(roleId);

      if (!role) {
        throw new CustomError('Role not found', 404);
      }

      if (roleData.roleName && roleData.roleName !== role.roleName) {
        role.roleName = roleData.roleName;
      }

      if (roleData.permissions && roleData.permissions.length > 0) {
        role.permissions = roleData.permissions;
      }

      return await role.save();
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw new CustomError('Failed to update role', 500, error);
    } 
  };

  /**
   * Delete a role
   * @param roleId - The ID of the role to delete
   * @throws CustomError if role not found or database operation fails
   */
  static deleteRole = async (roleId: string) => {
    try {
      const result = await Role.deleteOne({ _id: roleId });

      if (result.deletedCount === 0) {
        throw new CustomError('Role not found', 404);
      }

      return result.deletedCount > 0;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw new CustomError('Failed to delete role', 500, error);
    }
  };

  /**
   * Check if a role exists
   * @param roleId - The ID of the role to check
   * @throws CustomError if database operation fails
   */
  static roleExists = async (roleId: string) => {
    try {
      const count = await Role.countDocuments({ _id: roleId });
      return count > 0;
    } catch (error) {
      throw new CustomError('Failed to check if role exists', 500, error);
    }
  }
};
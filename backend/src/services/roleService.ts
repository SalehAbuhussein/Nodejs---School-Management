import mongoose from 'mongoose';

import Role, { IRole } from 'src/models/role.model';

import { UpdateRoleBody } from 'src/shared/types/roleController.types';

import { CustomError } from 'src/shared/utils/CustomError';

export class RoleService {
  /**
   * Retrieve all roles from the database
   * 
   * @returns {Promise<IRole[]>} A promise that resolves to an array of roles
   * @throws {CustomError} If database operation fails
   */
  static getAllRoles = async (): Promise<IRole[]> => {
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
   * Retrieve a specific role by ID
   * 
   * @param {string} roleId - The ID of the role to retrieve
   * @returns {Promise<IRole>} A promise that resolves to the role
   * @throws {CustomError} If role not found or database operation fails
   */
  static getRole = async (roleId: string): Promise<IRole> => {
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
   * 
   * @param {IRole} roleData - The role data to create
   * @returns {Promise<IRole>} A promise that resolves to the created role
   * @throws {CustomError} If validation fails or database operation fails
   */
  static createRole = async (roleData: IRole): Promise<IRole> => {
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
   * 
   * @param {string} roleId - The ID of the role to update
   * @param {Partial<IRole>} roleData - The updated role data
   * @returns {Promise<IRole>} A promise that resolves to the updated role
   * @throws {CustomError} If role not found or database operation fails
   */
  static updateRole = async (roleId: string, roleData: UpdateRoleBody): Promise<IRole> => {
    try {
      const role = await Role.findById(roleId);

      if (!role) {
        throw new CustomError('Role not found', 404);
      }

      if (roleData.roleName && roleData.roleName !== role.roleName) {
        role.roleName = roleData.roleName;
      }

      if (roleData.permissions && roleData.permissions.length > 0) {
        role.permissions = roleData.permissions.map(id => new mongoose.Schema.Types.ObjectId(id));
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
   * 
   * @param {string} roleId - The ID of the role to delete
   * @returns {Promise<boolean>} A promise that resolves to true if deletion was successful
   * @throws {CustomError} If role not found or database operation fails
   */
  static deleteRole = async (roleId: string): Promise<boolean> => {
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
   * 
   * @param {string} roleId - The ID of the role to check
   * @returns {Promise<boolean>} A promise that resolves to true if the role exists
   * @throws {CustomError} If database operation fails
   */
  static roleExists = async (roleId: string): Promise<boolean> => {
    try {
      const count = await Role.countDocuments({ _id: roleId });
      return count > 0;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Failed to check if role exists', 500, error);
    }
  }
};
import Role, { IRole } from 'src/db/models/role.model';

import { UpdateRoleBody } from 'src/v1/controllers/types/roleController.types';

import { CustomError } from 'src/shared/utils/CustomError';

/**
 * Retrieve a specific role by ID
 *
 * @param {string} roleId - The ID of the role to retrieve
 * @returns {Promise<IRole>} A promise that resolves to the role
 * @throws {CustomError} If role not found or database operation fails
 */
export const getRole = async (roleId: string): Promise<IRole> => {
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
export const createRole = async (roleData: IRole): Promise<IRole> => {
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
export const updateRole = async (roleId: string, roleData: UpdateRoleBody): Promise<IRole> => {
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
 *
 * @param {string} roleId - The ID of the role to delete
 * @returns {Promise<boolean>} A promise that resolves to true if deletion was successful
 * @throws {CustomError} If role not found or database operation fails
 */
export const deleteRole = async (roleId: string): Promise<boolean> => {
  try {
    const result = await Role.deleteOne({ _id: roleId });
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
export const checkRoleExists = async (roleId: string): Promise<boolean> => {
  try {
    const count = await Role.countDocuments({ _id: roleId });
    return count > 0;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to check if role exists', 500, error);
  }
};

export default {
  getRole,
  createRole,
  updateRole,
  deleteRole,
  roleExists: checkRoleExists,
};

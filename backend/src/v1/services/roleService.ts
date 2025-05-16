import Role, { IRole } from 'src/db/models/role.model';

import * as PermissionService from 'src/v1/services/permissionService';

import { PostRoleBody, UpdateRoleBody } from 'src/v1/controllers/types/roleController.types';

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
 * @param {PostRoleBody} roleData - The role data to create
 * @returns {Promise<IRole>} A promise that resolves to the created role
 * @throws {CustomError} If validation fails or database operation fails
 */
export const createRole = async (roleData: PostRoleBody): Promise<IRole> => {
  try {
    await validateCreateRoleBody(roleData);
    return Role.create(roleData);
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to create role', 500, error);
  }
};

/**
 * Validates role data before creation
 * 
 * This method performs validation checks to ensure the role data is valid
 * before creating a new role. It specifically verifies:
 * 1. Role name uniqueness - Ensures the role name doesn't already exist
 * 2. Permissions validity - Confirms all specified permissions exist in the system
 * 3. Data integrity - Validates required fields and data formats
 *
 * @param {PostRoleBody} roleData - The role data to validate
 *   @param {string} roleData.roleName - Name of the role to create
 *   @param {string[]} roleData.permissions - Array of permission IDs to assign to the role
 * 
 * @returns {Promise<void>} A promise that resolves if validation passes
 * 
 * @throws {CustomError} With appropriate status codes and messages:
 *   - 400: If the role name already exists
 *   - 400: If any of the specified permissions don't exist
 *   - 500: For unexpected server errors during validation
 * 
 * @example
 * try {
 *   await validateCreateRoleBody({
 *     roleName: "Teacher",
 *     permissions: ["60d5ec9af682fbd12a0b4d8b", "60d5ecb2f682fbd12a0b4d8c"]
 *   });
 *   // Validation passed, proceed with role creation
 * } catch (error) {
 *   if (error.statusCode === 400) {
 *     if (error.message === 'Role already exists') {
 *       console.error("A role with this name already exists");
 *     } else if (error.message === 'Invalid permissions') {
 *       console.error("One or more permissions are invalid");
 *     }
 *   } else {
 *     console.error(`Validation failed: ${error.message}`);
 *   }
 * }
 */
export const validateCreateRoleBody = async (roleData: PostRoleBody): Promise<void> => {
  try {
    const existingRole = await Role.findOne({ name: roleData.roleName });
    if (existingRole) {
      throw new CustomError('Role already exists', 400);
    }

    const arePermissionsValid = PermissionService.checkPermissionsExist(roleData.permissions);
    if (!arePermissionsValid) {
      throw new CustomError('Invalid permissions', 400);
    }
  } catch (error) {
    throw error;
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
 * Validates role data before update
 * 
 * This method performs validation checks to ensure the role update data is valid
 * before modifying an existing role. It specifically verifies:
 * 1. Role name uniqueness - If name is being changed, ensures it doesn't conflict with existing roles
 * 2. Permissions validity - Confirms all specified permissions exist in the system
 * 3. Data integrity - Validates update fields have proper formats and values
 *
 * @param {UpdateRoleBody} roleData - The updated role data
 *   @param {string} [roleData.roleName] - Updated name for the role
 *   @param {string[]} [roleData.permissions] - Updated array of permission IDs
 * 
 * @returns {Promise<void>} A promise that resolves if validation passes
 * 
 * @throws {CustomError} With appropriate status codes and messages:
 *   - 400: If the new role name already exists
 *   - 400: If any of the specified permissions don't exist
 *   - 500: For unexpected server errors during validation
 * 
 * @example
 * try {
 *   await validateUpdateRoleBody({
 *     roleName: "Senior Teacher",
 *     permissions: ["60d5ec9af682fbd12a0b4d8b", "60d5ecb2f682fbd12a0b4d8c", "60d5ecb2f682fbd12a0b4d8d"]
 *   });
 *   // Validation passed, proceed with role update
 * } catch (error) {
 *   if (error.statusCode === 400) {
 *     if (error.message === 'Role already exists') {
 *       console.error("A role with this name already exists");
 *     } else if (error.message === 'Invalid permissions') {
 *       console.error("One or more permissions are invalid");
 *     }
 *   } else {
 *     console.error(`Validation failed: ${error.message}`);
 *   }
 * }
 */
export const validateUpdateRoleBody = async (roleData: UpdateRoleBody): Promise<void> => {
  try {
    const isRoleExist = await Role.findOne({ name: roleData.roleName });
    if (!isRoleExist) {
      throw new CustomError('Role not found', 404);
    }

    const arePermissionsValid = PermissionService.checkPermissionsExist(roleData.permissions);
    if (!arePermissionsValid) {
      throw new CustomError('Invalid permissions', 400);
    }
  } catch (error) {
    throw error;
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
  checkRoleExists,
};

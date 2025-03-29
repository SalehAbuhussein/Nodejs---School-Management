import Permission from 'src/models/permission.model';
import { PermissionService } from 'src/services/permissionService';

/**
 * Check if Permission exist in database
 * 
 * @param { string } permissionId 
 */
export const checkPermissionExist = async (permissionId: string) => {
  try {
    return await PermissionService.permissionExists(permissionId);
  } catch (error) {
    throw new Error('Permission does not exist');
  }
};

/**
 * Check if list of Permissions exist in database
 * 
 * @param { string[] } permissionsList
 */
export const checkPermissionsExist = async (permissionsList: string[]) => {
  try {
    return await PermissionService.checkPermissionsExist(permissionsList);
  } catch (error) {
    throw new Error('Some Permissions do not exist');
  }
};
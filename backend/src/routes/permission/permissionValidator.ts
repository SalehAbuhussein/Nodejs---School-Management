import Permission from 'src/models/permission.model';

/**
 * Check if Permission exist in database
 * 
 * @param { string } permissionId 
 */
export const checkPermissionExist = async (permissionId: string) => {
  const foundPermission = await Permission.findOne({ _id: permissionId });

  if (!foundPermission) {
    throw new Error('Permission does not exist');
  }

  return true;
};

/**
 * Check if list of Permissions exist in database
 * 
 * @param { string[] } permissionsList
 */
export const checkPermissionsExist = async (permissionsList: string[]) => {
  const foundPermissions = await Permission.find({ _id: { $in: permissionsList }});

  if (foundPermissions.length !== permissionsList.length) {
    throw new Error('Some Permissions does not exist');
  }

  return true;
};
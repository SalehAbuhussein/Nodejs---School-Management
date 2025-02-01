import Permission from 'src/models/permission.model';

/**
 * Check if Permission exist in database
 * 
 * @param { string } id 
 */
export const checkPermissionExist = async (id: string) => {
  const foundPermission = await Permission.findOne({ _id: id });

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
    throw new Error('Some Permission does not exist in database');
  }

  return true;
};
import { RoleService } from 'src/services/roleService';

/**
 * Check Role Existence in database
 * 
 * @param { string } id
 */
export const checkRoleExist = async (id: string) => {
  const roleExist = await RoleService.roleExists(id);

  if (!roleExist) {
    throw new Error('Role does not exist');
  }

  return true;
};

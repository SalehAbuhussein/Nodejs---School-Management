import Role from 'src/models/role.model';

/**
 * Check Role Existence in database
 * 
 * @param { string } id
 */
export const checkRoleExist = async (id: string) => {
  const foundRole = await Role.findOne({ _id: id });

  if (!foundRole) {
    throw new Error('Role does not exist');
  }

  return true;
};

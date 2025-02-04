import User from 'src/models/user.model';

/**
 * Check if User exist in database
 * 
 * @param { string } userId 
 */
export const checkUserExist = (userId: string) => {
  const user = User.findById(userId);

  if (!user) {
    throw new Error('something went wrong');
  }

  return true;
};
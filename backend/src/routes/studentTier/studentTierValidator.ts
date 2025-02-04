import StudentTier from "src/models/studentTier.model";

/**
 * Check if StudentTier exist in database
 * 
 * @param { string } studentTierId 
 */
export const checkStudentTierExist = async (studentTierId: string) => {
  const studentTier = StudentTier.findById(studentTierId);

  if (!studentTier) {
    throw new Error('Student tier does not exist');
  }

  return true;
};
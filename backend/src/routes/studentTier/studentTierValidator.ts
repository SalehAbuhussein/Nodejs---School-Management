import { StudentTierService } from "src/services/studentTierService";

/**
 * Check if StudentTier exist in database
 * 
 * @param { string } studentTierId 
 */
export const checkStudentTierExist = async (studentTierId: string) => {
  const studentTier = StudentTierService.studentTierExist(studentTierId);

  if (!studentTier) {
    throw new Error('Student tier does not exist');
  }

  return true;
};
import Teacher from "src/models/teacher.model";

/**
 * Check if Teacher exist in database
 * 
 * @param { string } teacherId 
 */
export const checkTeacherExist = async (teacherId: string) => {
  const teacher = await Teacher.findById(teacherId);

  if (!teacher) {
    throw new Error('Teacher does not exist');
  }

  return true;
};
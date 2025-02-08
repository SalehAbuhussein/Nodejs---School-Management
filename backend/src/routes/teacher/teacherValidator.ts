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

/**
 * Check if teachers list exist in database
 * 
 * @param teachersIds 
 */
export const checkTeachersExist = async (teachersIds: string[]) => {
  const teachersList = await Teacher.find({ $in: teachersIds });

  if (teachersList.length !== teachersIds.length) {
    throw new Error('Some Teachers does not exist')
  }

  return true;
};
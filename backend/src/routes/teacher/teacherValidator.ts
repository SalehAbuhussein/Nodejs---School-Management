import { TeacherService } from "src/services/teacherService";

/**
 * Check if Teacher exist in database
 * 
 * @param { string } teacherId 
 */
export const checkTeacherExist = async (teacherId: string) => {
  const teacher = await TeacherService.teacherExists(teacherId  );

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
  const teachersExists = await TeacherService.teachersExists(teachersIds);

  if (!teachersExists) {
    throw new Error('Some Teachers does not exist')
  }

  return teachersExists;
};
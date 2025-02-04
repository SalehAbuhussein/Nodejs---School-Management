import Course from "src/models/course.model";

/**
 * Check if Course exist in database
 * 
 * @param { string } courseId 
 */
export const checkCourseExist = async (courseId: string) => {
  const course = Course.findById(courseId);

  if (!course) {
    throw new Error('Course does not exist');
  }

  return true;
};
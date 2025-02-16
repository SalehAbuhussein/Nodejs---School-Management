import Course from "src/models/course.model";

/**
 * Check if Course exist in database
 * 
 * @param { string } courseId 
 */
export const checkCourseExist = async (courseId: string) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error('Course does not exist');
  }

  return true;
};

/**
 * Check if Course is available to be enrolled at
 * 
 * @param { string } courseId 
 */
export const checkCourseIsAvailable = async (courseId: string) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error('Course does not exist');
  }

  if (course.isLocked) {
    throw new Error('Course slots are full');
  }

  return true;
}

/**
 * Check if Course exist in database
 * 
 * @param { string[] } coursesIds course ids 
 */
export const checkCoursesExist = async (coursesIds: string[]) => {
  const foundCourses = await Course.find({ _id: { $in: coursesIds }});

  if (foundCourses.length != coursesIds.length) {
    throw new Error('Some Courses does not exist');
  }

  return true;
};
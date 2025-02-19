import Enrollment from "src/models/enrollment.model"

/**
 * Check if enrollment exist
 * 
 * @param { string } enrollmentId 
 */
export const checkEnrollmentExist = async (enrollmentId: string) => {
  const enrollment = await Enrollment
    .where('isDeleted')
    .equals(false)
    .findOne({ _id: enrollmentId });

  if (!enrollment) {
    throw new Error('Enrollment does not exist');
  }

  return true;
};

/**
 * Check Duplicate Enrollment by student id and course id
 * 
 * @param { string } studentId 
 * @param { string } courseId 
 */
export const checkDuplicateEnrollment = async (studentId: string, courseId: string) => {
  const enrollment = await Enrollment
    .where('isDeleted')
    .equals(false)
    .findOne({ studentId, courseId });

  if (enrollment) {
    throw new Error('Existing Enrollment exist');
  }

  return true;
};
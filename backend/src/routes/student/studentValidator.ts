import Student from "src/models/student.model";

/**
 * Check if Student exist in database
 * 
 * @param { string } studentId 
 */
export const checkStudentExist = async (studentId: string) => {
  const student = Student.findOne({ _id: studentId });

  if (!student) {
    throw new Error('Student does not exist');
  }

  return true;
};
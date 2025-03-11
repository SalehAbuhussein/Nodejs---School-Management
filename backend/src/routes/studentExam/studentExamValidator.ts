import StudentExam from "src/models/studentExam.model";

/**
 * Check if Exam exist in database
 * 
 * @param { string } examId 
 */
export const checkStudentExamExist = async (examId: string) => {
  const exam = StudentExam.findOne({ _id: examId });

  if (!exam) {
    throw new Error('Exam does not exist');
  }

  return true;
};
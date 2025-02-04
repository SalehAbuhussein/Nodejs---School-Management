import Exam from "src/models/exam.model";

/**
 * Check if Exam exist in database
 * 
 * @param { string } examId 
 */
export const checkExamExist = async (examId: string) => {
  const exam = Exam.findOne({ _id: examId });

  if (!exam) {
    throw new Error('Exam does not exist');
  }

  return true;
};
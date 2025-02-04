import ExamType from "src/models/examType.model";

/**
 * Check if exam type exist in database
 * 
 * @param { string } examTypeId 
 */
export const checkExamTypeExist = async (examTypeId: string) => {
  const examType = ExamType.findOne({ _id: examTypeId });

  if (!examType) {
    throw new Error('Exam type does not exist');
  }

  return true;
};
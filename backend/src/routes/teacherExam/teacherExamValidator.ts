import TeacherExam from "src/models/teacherExam.model";

/**
 * Check if Exam exist in database
 * 
 * @param { string } examId 
 */
export const checkTeacherExamExist = async (examId: string) => {
  const exam = TeacherExam.findOne({ _id: examId });

  if (!exam) {
    throw new Error('Exam does not exist');
  }

  return true;
};
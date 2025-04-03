import { TeacherExamService } from "src/services/teacherExamService";

/**
 * Check if Exam exist in database
 * 
 * @param { string } examId 
 */
export const checkTeacherExamExist = async (examId: string) => {
  const exam = TeacherExamService.getTeacherExamById(examId);

  if (!exam) {
    throw new Error('Exam does not exist');
  }

  return true;
};
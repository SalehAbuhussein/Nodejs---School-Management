import { IStudentExam } from "src/models/studentExam.model";

export type GetStudentExamParams = { examId: string };

export type PostStudentExamBody = { 
  title: string, 
  subjectId: string,
  studentId: string,
  studentGrade: number 
};

export type UpdateStudentExamBody = Omit<PostStudentExamBody, 'studentId' | 'subjectId'>;

export type UpdateStudentExamParams = { examId: string };

export type DeleteStudentExamParams = { examId: string };

export type GetExamsResponse = {
  status: number,
  data: IStudentExam[] | null,
  message: string,
  error?: any,
};

export type GetStudentExamResponse = {
  status: number,
  data: IStudentExam | null,
  message: string,
  error?: any,
};

export type CreateStudentExamResponse = {
  status: number,
  data: IStudentExam | null,
  message: string,
  error?: any,
};

export type UpdateStudentExamResponse = {
  status: number,
  data: IStudentExam | null,
  message: string,
  error?: any,
};

export type DeleteStudentExamResponse = {
  status: number,
  message: string,
  error?: any,
};

/**
 * Take Exam types
 */

export type TakeTeacherExamParams = { examId: string };

export type TakeTeacherExamResponse = {
  status: number,
  message: string,
  error?: any,
};
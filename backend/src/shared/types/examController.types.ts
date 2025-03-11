import { IStudentExam } from "src/models/studentExam.model";

export type GetExamParams = { examId: string };

export type PostExamBody = { 
  title: string, 
  subjectId: string,
  studentId: string,
  studentGrade: number 
};

export type UpdateExamBody = PostExamBody;

export type UpdateExamParams = { examId: string };

export type DeleteExamParams = { examId: string };

export type GetExamsResponse = {
  status: number,
  data: IStudentExam[] | null,
  message: string,
  error?: any,
};

export type GetExamResponse = {
  status: number,
  data: IStudentExam | null,
  message: string,
  error?: any,
};

export type CreateExamResponse = {
  status: number,
  data: IStudentExam | null,
  message: string,
  error?: any,
};

export type UpdateExamResponse = {
  status: number,
  data: IStudentExam | null,
  message: string,
  error?: any,
};

export type DeleteExamResponse = {
  status: number,
  message: string,
  error?: any,
};
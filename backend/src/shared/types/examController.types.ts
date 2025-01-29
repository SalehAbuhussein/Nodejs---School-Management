import { IExam } from "src/models/exam.model";

export type GetExamParams = { examId: string };

export type PostExamBody = { 
  title: string, 
  courseId: string,
  examTypeId: string,
  studentId: string,
  fullExamGrade: number,
  studentGrade: number 
};

export type UpdateExamBody = PostExamBody;

export type UpdateExamParams = { examId: string };

export type DeleteExamParams = { examId: string };

export type GetExamsResponse = {
  status: number,
  data: IExam[] | null,
  message: string,
  error?: any,
};

export type GetExamResponse = {
  status: number,
  data: IExam | null,
  message: string,
  error?: any,
};

export type CreateExamResponse = {
  status: number,
  data: IExam | null,
  message: string,
  error?: any,
};

export type UpdateExamResponse = {
  status: number,
  data: IExam | null,
  message: string,
  error?: any,
};

export type DeleteExamResponse = {
  status: number,
  message: string,
  error?: any,
};
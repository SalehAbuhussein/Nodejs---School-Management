import { ITeacherExam } from "src/models/teacherExam.model";

export type GetTeacherExamParams = { teacherExamId: string };

export type PostTeacherExamBody = { 
  examTypeId: string,
  title: string, 
  fullExamGrade: number,
  subjectId: string,
};

export type UpdateTeacherExamBody = Omit<PostTeacherExamBody, 'examId' | 'examTypeId'>;

export type UpdateTeacherExamParams = { teacherExamId: string };

export type DeleteExamParams = { teacherExamId: string };

export type GetTeacherExamsResponse = {
  status: number,
  data: ITeacherExam[] | null,
  message: string,
  error?: any,
};

export type GetTeacherExamResponse = {
  status: number,
  data: ITeacherExam | null,
  message: string,
  error?: any,
};

export type CreateTeacherExamResponse = {
  status: number,
  data: ITeacherExam | null,
  message: string,
  error?: any,
};

export type UpdateTeacherExamResponse = {
  status: number,
  data: ITeacherExam | null,
  message: string,
  error?: any,
};
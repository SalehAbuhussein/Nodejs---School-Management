import { IStudent } from "src/models/student";

export type GetStudentParams = { studentId: string };

export type PostStudentBody = { 
  firstName: string, 
  secondName: string, 
  thirdName: string,
  lastName: string,
  userId: string,
};

export type UpdateStudentBody = PostStudentBody & { isActive: boolean, studentTierId: string };

export type UpdateStudentParams = { studentId: string };

export type DeleteStudentParams = { studentId: string };

export type GetStudentsResponse = {
  status: number,
  data: IStudent[] | null,
  message: string,
  error?: any,
};

export type GetStudentResponse = {
  status: number,
  data: IStudent | null,
  message: string,
  error?: any,
};

export type CreateStudentResponse = {
  status: number,
  data: IStudent | null,
  message: string,
  error?: any,
};

export type UpdateStudentResponse = {
  status: number,
  data: IStudent | null,
  message: string,
  error?: any,
};

export type DeleteStudentResponse = {
  status: number,
  message: string,
  error?: any,
};
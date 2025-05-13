import { IStudent } from 'src/db/models/student.model';

export type GetStudentParams = { studentId: string };

export type PostStudentBody = {
  firstName: string;
  secondName: string;
  thirdName: string;
  lastName: string;
  userId: string;
};

export type UpdateStudentBody = Omit<PostStudentBody, 'userId'> & { studentTierId: string };

export type UpdateStudentParams = { studentId: string };

export type DeleteStudentParams = { studentId: string };

export type GetStudentsResponse = {
  status: number;
  data: IStudent[] | null;
  message: string;
  error?: any;
};

export type GetStudentResponse = {
  status: number;
  data: IStudent | null;
  message: string;
  error?: any;
};

export type CreateStudentResponse = {
  status: number;
  data: IStudent | null;
  message: string;
  error?: any;
};

export type UpdateStudentResponse = {
  status: number;
  data: IStudent | null;
  message: string;
  error?: any;
};

export type DeleteStudentResponse = {
  status: number;
  message: string;
  data: IStudent | null;
  error?: any;
};

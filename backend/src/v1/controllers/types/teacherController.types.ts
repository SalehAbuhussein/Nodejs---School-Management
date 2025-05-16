import mongoose from 'mongoose';
import { ITeacher } from 'src/db/models/teacher.model';

export type GetTeacherParams = { teacherId: string };

export type PostTeacherBody = { firstName: string; secondName: string; thirdName: string | null; lastName: string; userId: string };

export type UpdateTeacherBody = Omit<PostTeacherBody, 'userId'> & { isActive: boolean; };

export type UpdateTeacherParams = { teacherId: string };

export type DeleteTeacherParams = { teacherId: string };

export type GetTeachersResponse = {
  status: number;
  data: ITeacher[] | null;
  message: string;
  error?: any;
};

export type GetTeacherResponse = {
  status: number;
  data: ITeacher | null;
  message: string;
  error?: any;
};

export type CreateTeacherResponse = {
  status: number;
  data: ITeacher | null;
  message: string;
  error?: any;
};

export type UpdateTeacherResponse = {
  status: number;
  message: string;
  data: ITeacher | null;
  error?: any;
};

export type DeleteTeacherResponse = {
  status: number;
  message: string;
  data: ITeacher | null;
  error?: any;
};

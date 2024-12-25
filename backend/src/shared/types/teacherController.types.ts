import mongoose from "mongoose";
import { ITeacher } from "src/models/teacher";

export type GetTeacherParams = { teacherId: string };

export type PostTeacherBody = { firstName: string, secondName: string, thirdName: string | null, lastName: string, userId: mongoose.Types.ObjectId };

export type UpdateTeacherBody = Omit<PostTeacherBody, 'userId'> & { isActive: boolean };

export type UpdateTeacherParams = { teacherId: string };

export type DeleteTeacherParams = { teacherId: string };

export type GetTeachersResponse = {
  status: number,
  data: ITeacher[] | null,
  message: string,
  error?: any,
};

export type GetTeacherResponse = {
  status: number,
  data: ITeacher | null,
  message: string,
  error?: any,
};

export type CreateTeacherResponse = {

};

export type UpdateTeacherResponse = {

};

export type DeleteTeacherResponse = {

};
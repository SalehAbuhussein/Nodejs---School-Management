import mongoose from "mongoose";
import { IUser } from "src/models/user.model";

export type GetUserParams = { userId: string };

export type PostUserBody = { name: string, email: string, password: string, role: mongoose.Types.ObjectId };

export type UpdateUserBody = PostUserBody & { _id: string };

export type UpdateUserParams = { userId: string };

export type DeleteUserParams = { userId: string };

export type GetUsersResponse = {
  status: number,
  data: IUser[] | null,
  message: string,
  error?: any,
};

export type GetUserResponse = {
  status: number,
  data: IUser | null,
  message: string,
  error?: any,
};

export type CreateUserResponse = {
  status: number,
  data: Partial<IUser> | null,
  message: string,
  error?: any,
};

export type UpdateUserResponse = {
  status: number,
  data: IUser | null,
  message: string,
  error?: any,
};

export type DeleteUserResponse = {
  status: number,
  message: string,
  data: IUser | null,
  error?: any,
};
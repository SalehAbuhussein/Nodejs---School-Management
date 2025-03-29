import { Request, Response, NextFunction } from 'express';

import { IUser } from 'src/models/user.model';

import { UserService } from 'src/services/userService';

import { IGetUserAuthInfoRequest } from 'src/middlewares/verifyTokenMiddleware';

import {
  DeleteUserParams,
  GetUserParams,
  PostUserBody,
  UpdateUserBody,
  UpdateUserParams,
  GetUserResponse,
  CreateUserResponse,
  UpdateUserResponse,
  DeleteUserResponse,
} from 'src/shared/types/userController.types';

export interface UserRequest extends Request {
  user: IUser,
};

/**
 * Get Single User
 * 
 * @param { Request } req 
 * @param { Response<GetUserResponse> } res 
 * @param { NextFunction } next
 */
export const getUser = async (req: Request, res: Response<GetUserResponse>, next: NextFunction) => {
  try {
    const params: GetUserParams = req.params as GetUserParams;

    const user = await UserService.findUserById(params.userId);

    if (!user) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Not Found!',
      })
    }

    return res.json({ 
      status: 200, 
      data: user,
      message: 'User Fetched Successfully!',
    });
  } catch (error: any) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
      data: null,
      error: error.originalError,
    });
  }
};

/**
 * Create User
 * 
 * @param { Request } req 
 * @param { Response<CreateUserResponse> } res 
 * @param { NextFunction } next 
 */
export const createUser = async (req: IGetUserAuthInfoRequest, res: Response<CreateUserResponse>, next: NextFunction) => {
  try {
    const { name, email, role, password }: PostUserBody = req.body;

    const userObject = await UserService.createUser({
      name: name,
      email: email,
      role: role,
      password: password,
      profileImg: req.file?.filename,
    } as IUser);

    return res.status(201).json({
      status: 201,
      data: userObject,
      message: 'User created successfully',
    });
  } catch (error: any) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
      data: null,
      error: error.originalError,
    });
  }
}; 

/**
 * Update User Data and remove previous user profileImg if it is modified
 * 
 * @param { Request } req 
 * @param { Response<UpdateUserResponse> } res 
 * @param { NextFunction } next
 */
export const updateUser = async (req: Request, res: Response<UpdateUserResponse>, next: NextFunction) => {
  try {
    const { name, email, password, role }: UpdateUserBody = req.body;
    const { userId }: UpdateUserParams = req.params as UpdateUserParams;
    const profileImg = req.file?.filename;

    const updatedUser = await UserService.updateUser(userId, { name, email, role, password, profileImg });

    return res.json({ 
      status: 200, 
      data: updatedUser,
      message: 'User Updated Successfully!', 
     });
  } catch (error: any) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
      data: null,
      error: error.originalError,
    });
  }
};

/**
 * Delete User
 * 
 * @param { Request } req 
 * @param { Response<DeleteUserResponse> } res 
 * @param { NextFunction } next
 */
export const deleteUser = async (req: Request, res: Response<DeleteUserResponse>, next: NextFunction) => {
  try {
    const { userId }: DeleteUserParams = req.params as DeleteUserParams;

    const isDeleted = await UserService.deleteUser(userId);

    if (!isDeleted) {
      return res.status(404).json({
        status: 404,
        message: 'Not Found!',
      });
    }

    return res.json({ 
      status: 200, 
      message: 'User Deleted Successfully!',
    });
  } catch (error: any) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
      error: error.originalError,
    });
  }
};
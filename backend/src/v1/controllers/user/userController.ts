import { Request, Response, NextFunction } from 'express';

import { IUser } from 'src/db/models/user.model';

import * as UserService from 'src/v1/services/userService';

import { IGetUserAuthInfoRequest } from 'src/shared/middlewares/validateJwtToken.middleware';

import { DeleteUserParams, GetUserParams, PostUserBody, UpdateUserBody, UpdateUserParams, GetUserResponse, CreateUserResponse, UpdateUserResponse, DeleteUserResponse } from 'src/v1/controllers/types/userController.types';

export interface UserRequest extends Request {
  user: IUser;
}

type PostLoginBody = { email: string; password: string };

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
      });
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
    const { name, email, password }: PostUserBody = req.body;

    const userObject = await UserService.createUser({
      name: name,
      email: email,
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
    const { name, email, password }: UpdateUserBody = req.body;
    const { userId }: UpdateUserParams = req.params as UpdateUserParams;
    const profileImg = req.file?.filename;

    const updatedUser = await UserService.updateUser(userId, { name, email, password, profileImg });

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
        data: null,
      });
    }

    return res.json({
      status: 200,
      message: 'User Deleted Successfully!',
      data: null,
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
 * Log user in and return JWT token
 *
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
export const postLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email, password }: PostLoginBody = req.body;

    const { token, user, refreshToken } = await UserService.loginUser(email, password);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    return res.json({
      status: 200,
      message: 'Authentication successfull!',
      token: token,
      user: user,
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
 * Generate  new JWT token by passing refresh token
 *
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { jwtToken, newRefreshToken } = await UserService.generateNewJwtToken(req.cookies.refreshToken);

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });

    return res.status(200).json({
      status: 200,
      message: 'Sent succesfully!',
      token: jwtToken,
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

import fs from 'fs/promises';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

import bcrypt from 'bcrypt';
import { HydratedDocument } from 'mongoose';

import User, { IUser } from 'src/models/user';

import { IGetUserAuthInfoRequest } from 'src/middlewares/validateToken';

import { 
  DeleteUserParams, 
  GetUserParams,
  PostUserBody,
  UpdateUserBody,
  UpdateUserParams,
  GetUserResponse, 
  GetUsersResponse,
  CreateUserResponse,
  UpdateUserResponse,
  DeleteUserResponse,
} from 'src/shared/types/userController.types';

/**
 * Get All Users
 * 
 * @param { Request } req 
 * @param { Response<GetUsersResponse> } res 
 * @param { NextFunction } next
 */
export const getUsers = async (req: Request, res: Response<GetUsersResponse>, next: NextFunction) => {
  try {
    const uploadsUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    const users = await User.find({}).select('-password');

    const usersWithProfileImg = users.map(user => {
      if (user.profileImg) {
        user.profileImg = `${uploadsUrl}${user.profileImg}`;
      }

      return user;
    });

    return res.json({ 
      status: 200, 
      data: usersWithProfileImg,
      message: 'Users Fetched Successfully!',
     });
    
  } catch (error) {
    return res.status(500).json({ 
      status: 500, 
      data: null, 
      error: error, 
      message: "Server Error"
     });
  }
};

/**
 * Get Single User
 * 
 * @param { Request } req 
 * @param { Response<GetUserResponse> } res 
 * @param { NextFunction } next
 */
export const getUser = async (req: Request, res: Response<GetUserResponse>, next: NextFunction) => {
  const params: GetUserParams = req.params as GetUserParams;
  const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;

  try {
    const user = await User.findById(params.userId);

    if (user?.profileImg) {
      user.profileImg = `${baseUrl}/${user.profileImg}`;
    }

    return res.json({ 
      status: 200, 
      data: user,
      message: 'User Fetched Successfully!',
     });
  } catch (error) {
    return res.status(500).json({ 
      status: 500, 
      data: null, 
      error: error, 
      message: 'Server Error',
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
  const body: PostUserBody = req.body;

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const newUser: HydratedDocument<IUser> = new User({ 
    name: body.name,
    profileImg: req.file?.filename,
    email: body.email,
    password: hashedPassword,
  });

  try {
    const user = await newUser.save();
    const userObject: Partial<IUser> = user.toObject();

    delete userObject.password;

    return res.status(201).json({
      status: 201,
      data: userObject,
      message: 'User created successfully',
    });
  } catch (error) {
    return res.status(500).send({ 
      status: 500, 
      data: null, 
      message: "Server Error",
      error: error, 
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
  const { name, email, password }: UpdateUserBody = req.body;
  const { userId }: UpdateUserParams = req.params as UpdateUserParams;
  const profileImg = req.file?.filename;

  try {
    let user = await User.findById({ _id:  userId });

    if (!user) {
      return res.status(404).json({ 
        status: 404, 
        data: null, 
        message: 'User Not Found!' 
      });
    }

    if (user?.email && email) {
      user.email = email;
    }

    if (user?.name && name) {
      user.name = name;
    }

    if (user?.password && password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
    }

    if (user?.profileImg && profileImg) {
      const uploadDirectory = `${path.dirname(path.dirname(require?.main?.filename ?? ''))}/uploads/`;
      
      await fs.unlink(`${uploadDirectory}/${user?.profileImg}`);

      user.profileImg = profileImg;
    }

    await user?.save();

    return res.json({ 
      status: 200, 
      data: user,
      message: 'User Updated Successfully!', 
     });
  } catch (error) {
    return res.status(500).json({ 
      status: 500, 
      data: null, 
      message: 'Server Error',
      error: error, 
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
  const { userId }: DeleteUserParams = req.params as DeleteUserParams;

  try {
    const user = await User.findById({ _id:  userId });

    if (user?.profileImg) {
      const uploadDirectory = `${path.dirname(path.dirname(require?.main?.filename ?? ''))}/uploads/`;
      
      await fs.unlink(`${uploadDirectory}/${user?.profileImg}`);
    }

    await user?.deleteOne();

    return res.json({ 
      status: 200, 
      message: 'User Deleted Successfully!',
     });
  } catch (error) {
    return res.status(500).json({ 
      status: 500, 
      message: 'Server Error', 
      error: error
     });
  }
};
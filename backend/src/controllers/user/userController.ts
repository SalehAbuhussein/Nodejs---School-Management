import fs from 'fs/promises';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

import bcrypt from 'bcrypt';

import User, { IUser } from '../../models/user';
import { HydratedDocument } from 'mongoose';

import { IGetUserAuthInfoRequest } from '../../middlewares/validateToken';

type PostUserBody = { name: string, email: string, password: string };

type UpdateUserBody = PostUserBody & { _id: string };

type UpdateUserParams = { userId: string };

type GetUserParams = { userId: string };

type DeleteUserParams = { userId: string };

/**
 * Get All Users
 * 
 * @param { Request } req 
 * @param { Response } res 
 * @param { NextFunction } next
 */
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const uploadsUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    const users = await User.find({}).select('-password');

    const usersWithProfileImg = users.map(user => {
      if (user.profileImg) {
        user.profileImg = `${uploadsUrl}${user.profileImg}`;
      }

      return user;
    });

    res.json({ status: 200, data: usersWithProfileImg });
    
  } catch (error) {
    res.status(500).json({ status: 500, data: [], error: error });
  }
};

/**
 * Get Single User
 * 
 * @param { Request } req 
 * @param { Response } res 
 * @param { NextFunction } next
 * @returns { Promise<void> }
 */
export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const params: GetUserParams = req.params as GetUserParams;
  const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;

  try {
    const user = await User.findById(params.userId);

    if (user?.profileImg) {
      user.profileImg = `${baseUrl}/${user.profileImg}`;
    }

    res.json({ status: 200, data: user });
  } catch (error) {
    res.status(500).json({ status: 500, data: [], error: error });
  }
};

/**
 * Create User
 * 
 * @param { Request } req 
 * @param { Response } res 
 * @param { NextFunction } next 
 * @returns { Promise<void> }
 */
export const createUser = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): Promise<void> => {
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

    res.status(201).json({
      status: 201,
      data: userObject,
      message: 'User created successfully',
    });
  } catch (error) {
    res.status(500).send({ status: 500, data: null, error: error, message: null });
  }
};

/**
 * Update User Data and remove previous user profileImg if it is modified
 * 
 * @param { Request } req 
 * @param { Response } res 
 * @param { NextFunction } next
 * @returns { Promise<void> }
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, email, password }: UpdateUserBody = req.body;
  const params: UpdateUserParams = req.params as UpdateUserParams;
  const profileImg = req.file?.filename;

  try {
    let user = await User.findById({ _id:  params.userId });

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

    res.json({ data: user, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error });
  }
};

/**
 * Delete User
 * 
 * @param { Request } req 
 * @param { Response } res 
 * @param { NextFunction } next
 * @returns { Promise<void> }
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId }: DeleteUserParams = req.params as DeleteUserParams;

  try {
    const user = await User.findById({ _id:  userId });

    if (user?.profileImg) {
      const uploadDirectory = `${path.dirname(path.dirname(require?.main?.filename ?? ''))}/uploads/`;
      
      await fs.unlink(`${uploadDirectory}/${user?.profileImg}`);
    }

    await user?.deleteOne();

    res.json({ message: 'User Deleted Successfully!', error: null });
  } catch (error) {
    res.status(500).json({ message: null, error: error });
  }
};
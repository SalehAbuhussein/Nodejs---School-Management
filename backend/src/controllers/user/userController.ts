import { Request, Response, NextFunction } from 'express';

import { HydratedDocument } from 'mongoose';

import User, { IUser } from '../../models/user';

type PostUserBody = { name: string, profileImg: string, username: string, email: string, password: string };

type UpdateUserBody = PostUserBody & { _id: string };

type GetUserParams = { userId: string };

/**
 * Get All Users
 * 
 * @param { Request } req 
 * @param { Response } res 
 * @param { NextFunction } next
 */
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.find({}).select('-password');
    
    res.json({ status: 200, data: users });
    
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

  try {
    const user = await User.findById(params.userId);
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
export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const body: PostUserBody = req.body;
  
  const newUser: HydratedDocument<IUser> = new User({ 
    name: body.name,
    profileImg: req.file?.filename,
    username: body.username,
    email: body.email,
    password: body.password,
  });

  try {
    const user = await newUser.save();
    const userObject: Partial<IUser> = user.toObject();

    delete userObject.password;

    res.json({
      status: 200,
      data: userObject,
      message: 'User created successfully',
    });
  } catch (error) {
    res.status(500).send({ error });
  }
};

/**
 * Update User
 * 
 * @param { Request } req 
 * @param { Response } res 
 * @param { NextFunction } next
 * @returns { Promise<void> }
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const body: UpdateUserBody = req.body;

  let user;

  try {
    user = await User.findById({ _id:  body._id });

    res.json({ data: user, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error })
  }
};
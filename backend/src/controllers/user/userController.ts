import { Request, Response, NextFunction } from 'express';

import { HydratedDocument } from 'mongoose';

import User, { IUser } from '../../models/user';

type PostUserBody = { name: string, profileImg: string, username: string, email: string, password: string };

/**
 * Create User and publish to database
 * in case of error redirect to
 * landing page
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
      data: userObject,
      message: 'User created successfully',
    });
  } catch (error) {
    res.status(500).send({ error });
  }
};

/**
 * Get All Users
 * 
 * @param { Request } req 
 * @param { Response } res 
 * @param { NextFunction } next
 * @returns { Promise<void> }
 */
export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.find({}).select('-password');
    
    res.json({ data: users });
    
  } catch (error) {
    res.status(500).json({ error })
  }
};
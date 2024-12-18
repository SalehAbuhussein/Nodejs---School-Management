import { Request, Response, NextFunction } from 'express';

import { HydratedDocument } from 'mongoose';

import User, { IUser } from '../../models/user';

type PostUserBody = { name: string, profileImg: string, username: string, email: string, password: string };

type UpdateUserBody = PostUserBody & { _id: string };

type UpdateUserParams = { userId: string };

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
  const { username, name, email, profileImg }: UpdateUserBody = req.body;
  const params: UpdateUserParams = req.params as UpdateUserParams;

  try {
    let user = await User.findById({ _id:  params.userId });

    if (user?.email && email) {
      user.email = email;
    }

    if (user?.name && name) {
      user.name = name;
    }

    if (user?.username && username) {
      user.username = username;
    }

    if (user?.profileImg && profileImg) {
      user.profileImg = profileImg;
    }

    await user?.save();

    res.json({ data: user, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error });
  }
};
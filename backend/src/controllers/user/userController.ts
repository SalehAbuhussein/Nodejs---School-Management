import { Request, Response, NextFunction } from 'express';

import User, { IUser } from '../../models/user';
import { HydratedDocument } from 'mongoose';

type PostUserBody = { username: string, email: string, password: string };

/**
 * Render user login page
 * 
 * @param { Request } req 
 * @param { Response } res 
 * @param { NextFunction } next 
 * @returns { void }
 */
export const getLogin = (req: Request, res: Response, next: NextFunction): void => {
  res.render('login', {
    path: 'login'
  });
};

/**
 * Render user signup page
 * 
 * @param { Request } req 
 * @param { Response } res 
 * @param { NextFunction } next 
 * @returns { void }
 */
export const getSignup = (req: Request, res: Response, next: NextFunction): void => {
  res.render('signup', {
    path: 'signup',
    errorMsg: req.flash('error')
  });
};

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
export const postUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const body: PostUserBody = req.body;

  const newUser: HydratedDocument<IUser> = new User({ username: body.username, email: body.email, password: body.password });

  try {
    await newUser.save();

    return res.redirect('/');
  } catch (err) {
    console.error(err);
    return res.redirect('/');
  }
};
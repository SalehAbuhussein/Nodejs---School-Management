import { Request, Response, NextFunction } from 'express';

import { UserService } from 'src/services/userService';

type PostLoginBody = { email: string, password: string };

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

    const userData = await UserService.authenticateUser(email, password);

    return res.json({
      status: 200,
      message: 'Authentication successfull!',
      token: userData.token,
      user: userData.user,
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
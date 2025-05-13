import { Request, Response, NextFunction } from 'express';

import jwt, { JwtPayload } from 'jsonwebtoken';

export interface IGetUserAuthInfoRequest extends Request {
  userId?: string | JwtPayload;
}

/**
 * Validate JWT token
 *
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
export const validateJwtToken = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    const token = req?.headers.authorization?.split(' ')[1];
    const jwtSecret = process.env.JWT_AUTH_TOKEN as string;
    const payload = jwt.verify(token as string, jwtSecret, {
      algorithms: ['HS256'],
    }) as { userId: string };

    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      error: 'You are not authorized to access this resource',
    });
  }
};

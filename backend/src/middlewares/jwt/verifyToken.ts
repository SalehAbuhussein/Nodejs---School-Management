import { Request, Response, NextFunction } from 'express';

import jwt, { JwtPayload } from 'jsonwebtoken';

export interface IGetUserAuthInfoRequest extends Request {
  user?: string | JwtPayload
};

/**
 * Validate JWT token
 * 
 * @param { Request } req 
 * @param { Response } res 
 * @param { NextFunction } next 
 */
export const verifyToken = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1]; // Bearer token
  
      const decoded = jwt.verify(token, 'yourSecretKey', { algorithms: ['HS256'] });
  
      req.user = decoded;
      next();
    } else {
      return res.status(401).json({
        status: 401,
        message: 'Token is not provided',
      })
    }
  } catch (error) {
    return res.status(401).json({
      status: 401,
      error: error,
    })
  }
};
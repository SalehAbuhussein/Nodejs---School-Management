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
export const validateToken = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer token

    jwt.verify(token, 'yourSecretKey', (err, payload) => {
      if (err) {
        res.status(403).json({
          success: false,
          message: 'Invalid Token',
        });
      } else {
        req.user = payload;
        next();
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Token is not provided',
    })
  }
};
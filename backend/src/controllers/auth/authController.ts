import { Request, Response, NextFunction } from 'express';

import bcrypto from 'bcrypt';
import { generateToken } from './jwtUtils';

type PostLoginBody = { email: string, password: string };

/**
 * Log user in and return JWT token 
 * 
 * @param { Request } req 
 * @param { Response } res 
 * @param { NextFunction } next 
 */
export const postLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password }: PostLoginBody = req.body;

  if (email && password) {
    const hashedPassword = await bcrypto.hash(password, 10);

    if (hashedPassword) {
      const token = generateToken({ email: email, password: hashedPassword });

      res.json({
        success: true,
        message: 'Authentication successfull!',
        token: token,
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }
  }
};
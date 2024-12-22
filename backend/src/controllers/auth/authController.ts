import { Request, Response, NextFunction } from 'express';

import bcrypto from 'bcrypt';
import { generateToken } from './jwtUtils';

import User from '../../models/user';

type PostLoginBody = { email: string, password: string };

/**
 * Log user in and return JWT token 
 * 
 * @param { Request } req 
 * @param { Response } res 
 * @param { NextFunction } next 
 */
export const postLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { email, password }: PostLoginBody = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      const isHashMatch = await bcrypto.compare(password, user.password);

      if (isHashMatch) {
        const token = generateToken(user.toJSON());

        return res.json({
          success: true,
          message: 'Authentication successfull!',
          token: token,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid username or password',
        });
      }

    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error", error: error });
  }
};
import { Request, Response, NextFunction } from 'express';

import bcrypto from 'bcrypt';

import { generateToken } from 'src/shared/utils/jwtUtils';

import User from 'src/models/user.model';

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

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: 'Invalid username or password',
      });
    }

    const isPasswordMatch = await bcrypto.compare(password, user.password);

    if (isPasswordMatch) {
      const token = generateToken(user.id);

      return res.json({
        status: 200,
        message: 'Authentication successfull!',
        token: token,
      });
    } else {
      return res.status(401).json({
        status: 401,
        message: 'Invalid username or password',
      });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server Error", error: error });
  }
};
import { JwtPayload, SignOptions, sign } from 'jsonwebtoken';

import { randomBytes } from 'crypto';

/**
 * Generate JWT token
 * 
 * @param { JwtPayload } payload 
 * @returns { string }
 */
export const generateToken = (payload: JwtPayload): string => {
  const secretKey = 'yourSecretKey';
  const options: SignOptions = {
    expiresIn: '1h',
    algorithm: 'HS256',
    jwtid: randomBytes(16).toString('hex'),
  };

  const token = sign(payload, secretKey, options);

  return token;
};
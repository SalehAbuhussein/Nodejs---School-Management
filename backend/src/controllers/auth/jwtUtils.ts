import { JwtPayload, SignOptions, sign } from 'jsonwebtoken';

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
  };

  const token = sign(payload, secretKey, options);

  return token;
};
import jwt, { JwtPayload, SignOptions, sign } from 'jsonwebtoken';

/**
 * Generate JWT token
 *
 * @param { JwtPayload } payload
 * @returns { string }
 */
export const generateAuthToken = (payload: JwtPayload): string => {
  const jwtSecret = process.env.JWT_AUTH_TOKEN as string;
  const options: SignOptions = { expiresIn: '15m', algorithm: 'HS256' };

  return sign(payload, jwtSecret, options);
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (payload: JwtPayload) => {
  const secretKey = process.env.JWT_REFRESH_TOKEN as string;
  const options: SignOptions = { expiresIn: '7d', algorithm: 'HS256' };

  return jwt.sign(payload, secretKey, options);
};

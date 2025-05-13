import path from 'path';
import fs from 'fs/promises';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User, { IUser } from 'src/db/models/user.model';
import RefreshToken from 'src/db/models/refreshToken.model';

import { generateAuthToken, generateRefreshToken } from 'src/shared/utils/jwtUtils';

import { CustomError } from 'src/shared/utils/CustomError';

/**
 * Find a user by ID
 *
 * @param {string} userId - The ID of the user to find
 * @returns {Promise<IUser | null>} Promise with user or null if not found
 * @throws {Error} If database operation fails
 */
export const findUserById = async (userId: string): Promise<IUser | null> => {
  try {
    return await User.findById(userId);
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Find a single user by email
 *
 * @param {string} email - The email to search for
 * @returns {Promise<IUser | null>} Promise with user or null if not found
 * @throws {Error} If database operation fails
 */
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  try {
    return User.findOne({ email });
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Create a new user
 *
 * @param {IUser} userData - User data to create
 * @returns {Promise<Partial<IUser>>} Promise with created user (without password)
 * @throws {Error} If database operation fails
 */
export const createUser = async ({ name, email, profileImg, password }: IUser): Promise<Partial<IUser>> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      email: email,
      profileImg: profileImg,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const userObject: Partial<IUser> = savedUser.toObject();

    delete userObject.password;
    return userObject;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Update an existing user
 *
 * @param {string} userId - The user ID to update
 * @param {Partial<IUser>} userData - The data to update
 * @returns {Promise<IUser|null>} Promise with updated user or null if not found
 * @throws {Error} If database operation fails
 */
export const updateUser = async (userId: string, userData: Partial<IUser>): Promise<IUser | null> => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return null;
    }

    if (userData.name !== undefined) {
      user.name = userData.name;
    }

    if (userData.email !== undefined) {
      user.email = userData.email;
    }

    if (userData.password !== undefined) {
      user.password = await bcrypt.hash(userData.password, 10);
    }

    // Handle profile image update
    if (userData.profileImg && user.profileImg) {
      const uploadDirectory = `${path.dirname(path.dirname(require?.main?.filename ?? ''))}/uploads/`;

      try {
        await fs.unlink(`${uploadDirectory}/${user.profileImg}`);
      } catch (error) {
        console.error('Error deleting old profile image:', error);
      }

      user.profileImg = userData.profileImg;
    } else if (userData.profileImg) {
      user.profileImg = userData.profileImg;
    }

    return await user.save();
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Delete a user
 *
 * @param {string} userId - The user ID to delete
 * @returns {Promise<boolean>} Promise with boolean indicating success
 * @throws {Error} If database operation fails
 */
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return false;
    }

    // Delete profile image if it exists
    if (user.profileImg) {
      const uploadDirectory = `${path.dirname(path.dirname(require?.main?.filename ?? ''))}/uploads/`;

      try {
        await fs.unlink(`${uploadDirectory}/${user.profileImg}`);
      } catch (error) {
        console.error('Error deleting profile image:', error);
      }
    }

    await user?.deleteOne();

    return true;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Login a user with email and password
 *
 * @throws {CustomError} If authentication fails
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new CustomError('Invalid email or password', 401);
    }

    const jwtToken = generateAuthToken({ email, userId: user._id.toString() });
    const refreshToken = generateRefreshToken({ email, userId: user._id.toString() });

    const refreshTokenSchema = new RefreshToken({ token: refreshToken, userId: user._id, tokenVersion: user.tokenVersion });
    await refreshTokenSchema.save();

    const userObject = user.toObject() as Partial<IUser>;
    delete userObject.password;

    return { user: userObject, token: jwtToken, refreshToken };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Generate a new JWT token using a refresh token
 *
 * @param {string} refreshToken - The refresh token to use
 * @returns {Promise<{jwtToken: string, newRefreshToken: string}>} New tokens
 * @throws {CustomError} If token generation fails
 */
export const generateNewJwtToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new CustomError('Unable to generate access token', 403);
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN as string) as { email: string; userId: number; tokenVersion: number };

    /**
     * After 7 days the TTL index will delete the token from the database
     * so this will prevent old refresh token from being used to generate
     * a new access token
     */
    const storedToken = await RefreshToken.findOne({ userId: payload.userId });
    if (!storedToken) {
      throw new CustomError('Unable to generate access token', 403);
    }

    const user = await User.findOne({ email: payload.email });
    if (!user) {
      // Delete Refresh Token (refresh token exist in database)
      await RefreshToken.deleteOne({ userId: payload.userId });
      throw new CustomError('Unable to generate access token', 403);
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      // Delete Refresh Token (refresh token exist in database)
      await RefreshToken.deleteOne({ userId: payload.userId });
      throw new CustomError('Unable to generate access token', 403);
    }

    const jwtToken = generateAuthToken({ email: user.email, userId: user._id.toString() });
    const newRefreshToken = generateRefreshToken({ email: user.email, userId: user._id.toString() });
    await RefreshToken.findOneAndUpdate({ userId: payload.userId }, { token: newRefreshToken }, { new: true });

    return { jwtToken, newRefreshToken };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 403);
  }
};

/**
 * Change user password
 *
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<boolean>} Success indicator
 * @throws {CustomError} If password change fails
 */
export const changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new CustomError('Something went wrong', 404);
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new CustomError('Something went wrong', 401);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return true;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to change password', 500, error);
  }
};

/**
 * Check if a user exists
 *
 * @param {string} userId - The user ID to check
 * @returns {Promise<boolean>} Whether the user exists
 * @throws {CustomError} If database operation fails
 */
export const checkUserExists = async (userId: string): Promise<boolean> => {
  try {
    const user = await findUserById(userId);
    return !!user;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to check user existence', 500, error);
  }
};

export default {
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  generateNewJwtToken,
  changePassword,
  checkUserExists,
};

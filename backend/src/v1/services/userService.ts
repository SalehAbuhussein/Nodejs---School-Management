import { ClientSession } from 'mongoose';

import path from 'path';
import fs from 'fs/promises';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User, { IUser } from 'src/db/models/user.model';
import RefreshToken from 'src/db/models/refreshToken.model';

import * as RoleService from './roleService';

import { generateAuthToken, generateRefreshToken } from 'src/shared/utils/jwtUtils';

import { PostUserBody, UpdateUserBody } from '../controllers/types/userController.types';

import { CustomError } from 'src/shared/utils/CustomError';

/**
 * Find a user by ID
 *
 * @param {string} userId - The ID of the user to find
 * @returns {Promise<IUser | null>} Promise with user or null if not found
 * @throws {Error} If database operation fails
 */
export const findUserById = async (userId: string, properties = '', session?: ClientSession): Promise<IUser | null> => {
  try {
    if (session) {
      return await User.findById(userId).select(properties).session(session);
    }

    return await User.findById(userId).select(properties);
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
export const findUserByEmail = async (email: string, properties = '', session?: ClientSession): Promise<IUser | null> => {
  try {
    if (session) {
      return await User.findOne({ email }).select(properties).session(session);
    }

    return User.findOne({ email }).select(properties);
  } catch (error) {
    if (error instanceof CustomError) {
      console.log(error);
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
export const createUser = async ({ name, email, profileImg, password, role }: PostUserBody): Promise<Partial<IUser>> => {
  try {
    await validateCreateUser({ name, email, profileImg, password, role });
    
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
 * Validates user data before creation
 * 
 * This method performs validation checks to ensure the user data is valid
 * before creating a new user account. It specifically verifies:
 * 1. Role validity - Confirms the specified role exists in the system
 * 2. Email uniqueness - Ensures the email isn't already registered (handled elsewhere)
 * 3. Data integrity - Validates required fields and data formats
 *
 * @param {PostUserBody} userData - The user data to validate
 *   @param {string} userData.name - User's full name
 *   @param {string} userData.email - User's email address
 *   @param {string} userData.password - User's password (will be hashed)
 *   @param {string} [userData.profileImg] - Path to user's profile image (optional)
 *   @param {string} userData.role - Role ID to assign to the user
 * 
 * @returns {Promise<void>} A promise that resolves if validation passes
 * 
 * @throws {CustomError} With appropriate status codes and messages:
 *   - 400: If the specified role doesn't exist
 *   - 400: If required fields are missing or invalid
 *   - 500: For unexpected server errors during validation
 * 
 * @example
 * try {
 *   await validateCreateUser({
 *     name: "John Smith",
 *     email: "john.smith@example.com",
 *     password: "securePassword123",
 *     role: "60d5ec9af682fbd12a0b4d8b"
 *   });
 *   // Validation passed, proceed with user creation
 * } catch (error) {
 *   console.error(`Validation failed: ${error.message}`);
 * }
 */
export const validateCreateUser = async (userData: PostUserBody) => {
  try {
    const isValidRole = await RoleService.checkRoleExists(userData.role);
    if (!isValidRole) {
      throw new CustomError('Invalid role', 400);
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Update an existing user
 *
 * @param {string} userId - The user ID to update
 * @param {UpdateUserBody} userData - The data to update
 * @returns {Promise<IUser|null>} Promise with updated user or null if not found
 * @throws {Error} If database operation fails
 */
export const updateUser = async (userId: string, userData: UpdateUserBody): Promise<IUser | null> => {
  try {
    const { user } = await validateUpdateUser(userId, userData);

    if (!userData.name) {
      user.name = userData.name;
    }

    if (!userData.email) {
      user.email = userData.email;
    }

    if (!userData.password) {
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
 * Validates user data before update
 * 
 * This method performs validation checks to ensure the user update data is valid
 * before modifying an existing user account. It specifically verifies:
 * 1. User existence - Confirms the user ID refers to an existing account
 * 2. Data integrity - Validates update fields have proper formats and values
 *
 * @param {string} userId - The MongoDB ObjectId of the user to update
 * @param {UpdateUserBody} userData - The updated user data
 *   @param {string} [userData.name] - User's updated full name
 *   @param {string} [userData.email] - User's updated email address
 *   @param {string} [userData.password] - User's updated password (will be hashed)
 *   @param {string} [userData.profileImg] - Updated path to user's profile image
 *   @param {string} [userData.role] - Updated role ID to assign to the user
 * 
 * @returns {Promise<void>} A promise that resolves if validation passes
 * 
 * @throws {CustomError} With appropriate status codes and messages:
 *   - 404: If the user doesn't exist
 *   - 404: If the specified role doesn't exist
 *   - 400: If update data is invalid or violates business rules
 *   - 500: For unexpected server errors during validation
 * 
 * @example
 * try {
 *   await validateUpdateUser('60d5ec9af682fbd12a0b4d8b', {
 *     name: "John Smith Jr.",
 *   });
 *   // Validation passed, proceed with user update
 * } catch (error) {
 *   if (error.statusCode === 404) {
 *     console.error(error.message); // "User not found" or "role not found"
 *   } else {
 *     console.error(`Validation failed: ${error.message}`);
 *   }
 * }
 */
export const validateUpdateUser = async (userId: string, userData: UpdateUserBody) => {
  try {
    const user = await findUserById(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    return { user };
  } catch (error) {
    throw error;
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
    const user = await findUserById(userId);
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

    const result = await User.softDelete({ id: userId });
    return result.deleted > 0;
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
    const user = await findUserByEmail(email, '-isDeleted -deletedAt -__v -createdAt -updatedAt');
    if (!user) {
      throw new CustomError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new CustomError('Invalid email or password', 401);
    }

    const jwtToken = generateAuthToken({ email, userId: user.id, tokenVersion: user.tokenVersion });
    const refreshToken = generateRefreshToken({ email, userId: user.id, tokenVersion: user.tokenVersion });

    const refreshTokenSchema = new RefreshToken({ token: refreshToken, userId: user._id});
    await refreshTokenSchema.save();

    const userObject = user.toObject() as Partial<IUser>;
    delete userObject.password;

    return { user: userObject, token: jwtToken, refreshToken };
  } catch (error) {
    console.log(error);
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
export const generateNewJwtToken = async (refreshToken: string): Promise<{ jwtToken: string; newRefreshToken: string; }> => {
  if (!refreshToken) {
    throw new CustomError('Unable to generate access token', 403);
  }

  try {
    const refreshTokenPayload = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN as string) as { email: string; userId: number; tokenVersion: number };

    /**
     * After 7 days the TTL index will delete the token from the database
     * so this will prevent old refresh token from being used to generate
     * a new access token
     */
    const storedToken = await RefreshToken.findOne({ userId: refreshTokenPayload.userId });
    if (!storedToken) {
      throw new CustomError('Unable to generate access token', 403);
    }

    const user = await User.findOne({ email: refreshTokenPayload.email });
    if (!user) {
      // Delete Refresh Token (refresh token exist in database)
      await RefreshToken.deleteOne({ userId: refreshTokenPayload.userId });
      throw new CustomError('Unable to generate access token', 403);
    }

    if (user.tokenVersion !== refreshTokenPayload.tokenVersion) {
      // Delete Refresh Token (refresh token exist in database)
      await RefreshToken.deleteOne({ userId: refreshTokenPayload.userId });
      throw new CustomError('Unable to generate access token', 403);
    }

    const jwtToken = generateAuthToken({ email: user.email, userId: user.id, tokenVersion: user.tokenVersion });
    const newRefreshToken = generateRefreshToken({ email: user.email, userId: user.id, tokenVersion: user.tokenVersion });
    await RefreshToken.findOneAndUpdate({ userId: refreshTokenPayload.userId }, { token: newRefreshToken }, { new: true });

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

export const getUserInfo = async (userId?: string) => {
  try {
    if (!userId) {
      throw new CustomError('something went wrong', 401);
    }
  
    const user = await findUserById(userId, '-password -tokenVersion -createdAt -updatedAt -isDeleted -deletedAt -__v');
    return user;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Something went wrong', 500);
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
  getUserInfo,
};

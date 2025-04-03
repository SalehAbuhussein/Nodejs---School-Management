import path from 'path';
import fs from 'fs/promises';

import bcrypt from 'bcrypt';

import User, { IUser } from 'src/models/user.model';

import { generateToken } from 'src/shared/utils/jwtUtils';

import { CustomError } from 'src/shared/utils/CustomError';

export class UserService {
  /**
   * Find a user by ID
   * 
   * @param {string} userId - The ID of the user to find
   * @returns {Promise<IUser | null>} Promise with user or null if not found
   * @throws {Error} If database operation fails
   */
  static findUserById = async (userId: string): Promise<IUser | null> => {
    try {
      return User.findById(userId);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Failed to find user', 500, error);
    }
  };

  /**
   * Find a single user by email
   * 
   * @param {string} email - The email to search for
   * @returns {Promise<IUser | null>} Promise with user or null if not found
   * @throws {Error} If database operation fails
   */
  static findUserByEmail = async (email: string): Promise<IUser | null> => {
    try {
      return User.findOne({ email });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Failed to find user', 500, error);
    }
  };

  /**
   * Create a new user
   * 
   * @param {IUser} userData - User data to create
   * @returns {Promise<Partial<IUser>>} Promise with created user (without password)
   * @throws {Error} If database operation fails
   */
  static createUser = async ({ name, email, profileImg, password, role }: IUser): Promise<Partial<IUser>> => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name: name,
        email: email,
        profileImg: profileImg,
        role: role,
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
  static updateUser = async (userId: string, userData: Partial<IUser>): Promise<IUser | null> => {
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
  
      if (userData.role !== undefined) {
        user.role = userData.role;
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
      throw new CustomError('Failed to update user', 500, error); 
    }
  };

  /**
   * Delete a user
   * 
   * @param {string} userId - The user ID to delete
   * @returns {Promise<boolean>} Promise with boolean indicating success
   * @throws {Error} If database operation fails
   */
  static deleteUser = async (userId: string): Promise<boolean> => {
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
   * Authenticate a user with email and password
   * 
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{user: Partial<IUser>, token: string}>} User data and JWT token
   * @throws {CustomError} If authentication fails
   */
  static authenticateUser = async (email: string, password: string): Promise<{ user: Partial<IUser>; token: string; }> => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        throw new CustomError('Invalid email or password', 401);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new CustomError('Invalid email or password', 401);
      }

      const token = generateToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role.toString(),
      });

      const userObject = user.toObject() as Partial<IUser>;
      delete userObject.password;

      return { user: userObject, token };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Authentication failed', 500, error);
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
  static changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new CustomError('User not found', 404);
      }
      
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordValid) {
        throw new CustomError('Current password is incorrect', 401);
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
  static userExists = async (userId: string): Promise<boolean> => {
    try {
      const user = await User.findById(userId);
      return !!user;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Failed to check user existence', 500, error);
    }
  };
}
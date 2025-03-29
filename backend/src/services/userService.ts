import path from 'path';
import fs from 'fs/promises';

import bcrypt from 'bcrypt';

import User, { IUser } from 'src/models/user.model';

export class UserService {
  /**
   * Find all users with optional filtering
   * @param filter - Optional filter criteria
   * @returns Promise with array of users
   */
  static findUserById = async (userId: string): Promise<IUser | null> => {
    return User.findById(userId);
  }

  /**
   * Find a single user by email
   * @param email - The email to search for
   * @returns Promise with user or null if not found
   */
  static findUserByEmail = async (email: string): Promise<IUser | null> => {
    return User.findOne({ email });
  }

  /**
   * Create a new user
   * @param userData - User data to create
   * @param profileImg - Optional profile image filename
   * @returns Promise with created user
   */
  static createUser = async ({ name, email, profileImg, password, role }: IUser): Promise<Partial<IUser>> => {
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
  }

  /**
   * Update an existing user
   * @param userId - The user ID to update
   * @param userData - The data to update
   * @param profileImg - Optional new profile image filename
   * @returns Promise with updated user or null if not found
   */
  static updateUser = async (userId: string, userData: Partial<IUser>) => {
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
  }

  /**
   * Delete a user
   * @param userId - The user ID to delete
   * @returns Promise with boolean indicating success
   */
  static deleteUser = async (userId: string) => {
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
  }
}
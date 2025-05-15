import { ClientSession } from 'mongoose';

import Teacher, { ITeacher } from 'src/db/models/teacher.model';

import * as UserService from 'src/v1/services/userService';

import { PostTeacherBody, UpdateTeacherBody } from '../controllers/types/teacherController.types';

import { CustomError } from 'src/shared/utils/CustomError';

/**
 * Retrieve all teachers from the database
 *
 * @returns {Promise<ITeacher[]>} A promise that resolves to an array of teachers
 * @throws {CustomError} If database operation fails
 */
export const getAllTeachers = async (): Promise<ITeacher[]> => {
  try {
    const teachers = await Teacher.find();
    return teachers;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Retrieve a specific teacher by ID
 *
 * @param {string} teacherId - The ID of the teacher to retrieve
 * @returns {Promise<ITeacher>} A promise that resolves to the teacher
 * @throws {CustomError} If teacher not found or database operation fails
 */
export const getTeacherById = async (teacherId: string, session?: ClientSession): Promise<ITeacher | null> => {
  try {
    if (session) {
      return await Teacher.findById(teacherId).session(session);
    }

    return await Teacher.findById(teacherId);
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Create a new teacher
 *
 * @param {PostTeacherBody} teacherData - The teacher data to create
 * @returns {Promise<ITeacher>} A promise that resolves to the created teacher
 * @throws {CustomError} If validation fails or database operation fails
 */
export const createTeacher = async (teacherData: PostTeacherBody): Promise<ITeacher> => {
  try {
    await validateCreateTeacher(teacherData);
    return await new Teacher(teacherData).save();
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Validates teacher data before creation
 * 
 * This method performs validation checks to ensure the teacher data is valid
 * before creating a new teacher record. It specifically checks:
 * 1. User existence - Verifies the referenced user ID exists
 * 2. Duplicate prevention - Ensures the user isn't already associated with a teacher
 * 3. Data integrity - Validates required fields and data formats
 *
 * @param {PostTeacherBody} teacherData - The teacher data to validate
 *   @param {string} teacherData.firstName - Teacher's first name
 *   @param {string} teacherData.secondName - Teacher's second name
 *   @param {string} [teacherData.thirdName] - Teacher's third name (optional)
 *   @param {string} teacherData.lastName - Teacher's last name
 *   @param {string} teacherData.userId - Reference to the user account
 *   @param {string[]} [teacherData.subjects] - Array of subject IDs (optional)
 *   @param {boolean} [teacherData.isActive=true] - Teacher's active status
 * 
 * @returns {Promise<void>} A promise that resolves if validation passes
 * 
 * @throws {CustomError} With appropriate status codes and messages:
 *   - 409: If a teacher record already exists for the user
 *   - 404: If the referenced user doesn't exist
 *   - 400: If required fields are missing or invalid
 *   - 500: For unexpected server errors during validation
 * 
 * @example
 * try {
 *   await validateCreateTeacher({
 *     firstName: "John",
 *     secondName: "David",
 *     lastName: "Smith",
 *     userId: "60d5ec9af682fbd12a0b4d8b"
 *   });
 *   // Validation passed, proceed with teacher creation
 * } catch (error) {
 *   if (error.statusCode === 409) {
 *     console.error("Teacher already exists for this user");
 *   } else {
 *     console.error(`Validation failed: ${error.message}`);
 *   }
 * }
 */
export const validateCreateTeacher = async (teacherData: PostTeacherBody) => {
  try {
    const isUserExist = await UserService.checkUserExists(teacherData.userId);
    if (!isUserExist) {
      throw new CustomError('User not found', 404);
    }

    const isTeacherExist = await checkTeacherExistsByUserId(teacherData.userId);
    if (!isTeacherExist) {
      throw new CustomError('Teacher already exists', 409);
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing teacher
 *
 * @param {string} teacherId - The ID of the teacher to update
 * @param {Omit<ITeacher, 'userId'>} teacherData - The updated teacher data
 * @returns {Promise<ITeacher>} A promise that resolves to the updated teacher
 * @throws {CustomError} If teacher not found or database operation fails
 */
export const updateTeacher = async (teacherId: string, teacherData: UpdateTeacherBody): Promise<ITeacher> => {
  try {
    const { teacher } = await validateUpdateTeacher(teacherId, teacherData);

    if (teacher.firstName !== teacherData.firstName) {
      teacher.firstName = teacherData.firstName;
    }

    if (teacher.secondName !== teacherData.secondName) {
      teacher.secondName = teacherData.secondName;
    }

    if (teacher.thirdName !== teacherData.thirdName) {
      teacher.thirdName = teacherData.thirdName;
    }

    if (teacher.lastName !== teacherData.lastName) {
      teacher.lastName = teacherData.lastName;
    }

    if (teacher.isActive !== teacherData.isActive) {
      teacher.isActive = teacherData.isActive;
    }

    return await teacher.save();
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Validates teacher data before updating
 * 
 * This method performs validation checks to ensure the teacher update data is valid
 * before modifying an existing teacher record. It verifies:
 * 1. Teacher existence - Confirms the teacher ID refers to an existing record
 * 2. Data integrity - Validates the update fields have proper formats and values
 * 3. Business rules - Ensures the update doesn't violate any business constraints
 *
 * @param {string} teacherId - The MongoDB ObjectId of the teacher to update
 * @param {Omit<ITeacher, 'userId'>} teacherData - The updated teacher data
 *   @param {string} teacherData.firstName - Teacher's first name
 *   @param {string} teacherData.secondName - Teacher's second name
 *   @param {string} [teacherData.thirdName] - Teacher's third name (optional)
 *   @param {string} teacherData.lastName - Teacher's last name
 *   @param {boolean} [teacherData.isActive] - Teacher's active status
 *   @param {string[]} [teacherData.subjects] - Array of subject IDs
 * 
 * @returns {Promise<void>} A promise that resolves if validation passes
 * 
 * @throws {CustomError} With appropriate status codes and messages:
 *   - 404: If the teacher record doesn't exist
 *   - 400: If update data is invalid or violates business rules
 *   - 500: For unexpected server errors during validation
 * 
 * @example
 * try {
 *   await validateUpdateTeacher('60d5ec9af682fbd12a0b4d8b', {
 *     firstName: "John",
 *     secondName: "David",
 *     lastName: "Smith",
 *     isActive: true,
 *     subjects: ["60d5ecb2f682fbd12a0b4d8c"]
 *   });
 *   // Validation passed, proceed with teacher update
 * } catch (error) {
 *   if (error.statusCode === 404) {
 *     console.error("Teacher not found");
 *   } else {
 *     console.error(`Validation failed: ${error.message}`);
 *   }
 * }
 */
export const validateUpdateTeacher = async (teacherId: string, teacherData: UpdateTeacherBody) => {
  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new CustomError('Teacher Not Found', 404);
    }

    return { teacher };
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a teacher
 *
 * @param {string} teacherId - The ID of the teacher to delete
 * @returns {Promise<boolean>} A promise that resolves to true if deletion was successful
 * @throws {CustomError} If teacher not found or database operation fails
 */
export const deleteTeacher = async (teacherId: string): Promise<boolean> => {
  try {
    const result = await Teacher.softDelete({ _id: teacherId });;
    return result.deleted === 1;
  } catch (error) {
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Check if a teacher exists
 *
 * @param {string} teacherId - The ID of the teacher to check
 * @returns {Promise<boolean>} A promise that resolves to true if the teacher exists
 * @throws {CustomError} If database operation fails
 */
export const checkTeacherExists = async (teacherId: string): Promise<boolean> => {
  try {
    const teacher = await Teacher.findById(teacherId);
    return !!teacher;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

export const checkTeacherExistsByUserId = async (userId: string): Promise<boolean> => {
  try {
    const teacher = await Teacher.findOne({ userId });
    return !!teacher;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Check if multiple teachers exist
 *
 * @param {string[]} teachersIds - The IDs of the teachers to check
 * @returns {Promise<boolean>} A promise that resolves to true if all teachers exist
 * @throws {CustomError} If database operation fails
 */
export const checkTeachersExists = async (teachersIds: string[]): Promise<boolean> => {
  try {
    const teachersList = await Teacher.find({ $in: teachersIds });

    if (teachersList.length !== teachersIds.length) {
      return false;
    }

    return true;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

export default {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  teacherExists: checkTeacherExists,
  teachersExists: checkTeachersExists,
};

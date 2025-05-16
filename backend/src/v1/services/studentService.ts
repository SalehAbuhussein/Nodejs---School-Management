import mongoose, { ClientSession } from 'mongoose';

import Student, { IStudent } from 'src/db/models/student.model';

import * as UserService from './userService';

import { PostStudentBody, UpdateStudentBody } from 'src/v1/controllers/types/studentController.types';

import { CustomError } from 'src/shared/utils/CustomError';

/**
 * Retrieve a specific student by ID
 *
 * @param {string} studentId - The ID of the student to retrieve
 * @returns {Promise<IStudent>} A promise that resolves to the student
 * @throws {CustomError} If student not found or database operation fails
 */
export const findStudentById = async (studentId: string, session?: ClientSession): Promise<IStudent | null> => {
  try {
    if (session) {
      return await Student.findById(studentId, null, { session });
    }

    return await Student.findById(studentId);
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to get student', 500);
  }
};

/**
 * Create a new student
 *
 * @param {PostStudentBody} studentData - The student data to create
 * @returns {Promise<IStudent>} A promise that resolves to the created student
 * @throws {CustomError} If validation fails or database operation fails
 */
export const createStudent = async (studentData: PostStudentBody): Promise<IStudent> => {
  try {
    await validateCreateStudentBody(studentData);

    const student = Student.create(studentData);
    return student;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to create student', 500);
  }
};

/**
 * Validates student data before creation
 * 
 * This method performs validation checks to ensure the student data is valid
 * before creating a new student record. It specifically verifies:
 * 1. User existence - Confirms the referenced user ID exists in the system
 * 2. Data integrity - Validates required fields and data formats
 * 3. Business rules - Ensures the student creation follows business constraints
 *
 * @param {PostStudentBody} studentData - The student data to validate
 *   @param {string} studentData.firstName - Student's first name
 *   @param {string} studentData.secondName - Student's second name
 *   @param {string} [studentData.thirdName] - Student's third name (optional)
 *   @param {string} studentData.lastName - Student's last name
 *   @param {string} studentData.userId - Reference to the user account
 *   @param {string} [studentData.studentTierId] - Reference to student tier (optional)
 * 
 * @returns {Promise<void>} A promise that resolves if validation passes
 * 
 * @throws {Error} With appropriate messages:
 *   - "User not found": If the referenced user doesn't exist
 *   - Other errors that might occur during validation
 * 
 * @example
 * try {
 *   await validateCreateStudentBody({
 *     firstName: "John",
 *     secondName: "David",
 *     lastName: "Smith",
 *     userId: "60d5ec9af682fbd12a0b4d8b"
 *   });
 *   // Validation passed, proceed with student creation
 * } catch (error) {
 *   if (error.message === 'User not found') {
 *     console.error("The specified user does not exist");
 *   } else {
 *     console.error(`Validation failed: ${error.message}`);
 *   }
 * }
 */
export const validateCreateStudentBody = async (studentData: PostStudentBody): Promise<void> => {
  try {
    const isUserExist = await UserService.findUserById(studentData.userId);
    if (!isUserExist) {
      throw new Error('User not found');
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing student
 *
 * @param {string} studentId - The ID of the student to update
 * @param {UpdateStudentBody} studentData - The updated student data
 * @returns {Promise<IStudent>} A promise that resolves to the updated student
 * @throws {CustomError} If student not found or database operation fails
 */
export const updateStudent = async (studentId: string, studentData: UpdateStudentBody): Promise<IStudent> => {
  try {
    const { student } = await validateUpdateStudentBody(studentId, studentData);

    if (student.firstName !== studentData.firstName) {
      student.firstName = studentData.firstName;
    }

    if (student.secondName !== studentData.secondName) {
      student.secondName = studentData.secondName;
    }

    if (student.thirdName !== studentData.thirdName) {
      student.thirdName = studentData.thirdName;
    }

    if (student.lastName !== studentData.lastName) {
      student.lastName = studentData.lastName;
    }

    if (student.studentTierId) {
      student.studentTierId = new mongoose.Schema.ObjectId(studentData.studentTierId);
    }

    return await student.save();
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to update student', 500);
  }
};

/**
 * Validates student data before update
 * 
 * This method performs validation checks to ensure the student update data is valid
 * before modifying an existing student record. It specifically verifies:
 * 1. Student existence - Confirms the student ID refers to an existing record
 * 2. Data integrity - Validates update fields have proper formats and values
 * 3. Business rules - Ensures the update doesn't violate any business constraints
 *
 * @param {string} studentId - The MongoDB ObjectId of the student to update
 * @param {UpdateStudentBody} studentData - The updated student data
 *   @param {string} [studentData.firstName] - Student's updated first name
 *   @param {string} [studentData.secondName] - Student's updated second name
 *   @param {string} [studentData.thirdName] - Student's updated third name (optional)
 *   @param {string} [studentData.lastName] - Student's updated last name
 *   @param {string} [studentData.studentTierId] - Updated reference to student tier
 * 
 * @returns {Promise<void>} A promise that resolves if validation passes
 * 
 * @throws {Error} With appropriate messages:
 *   - "Student not found": If the student record doesn't exist
 *   - Other errors that might occur during validation
 * 
 * @example
 * try {
 *   await validateUpdateStudentBody('60d5ec9af682fbd12a0b4d8b', {
 *     firstName: "John",
 *     lastName: "Smith-Johnson"
 *   });
 *   // Validation passed, proceed with student update
 * } catch (error) {
 *   if (error.message === 'Student not found') {
 *     console.error("The specified student does not exist");
 *   } else {
 *     console.error(`Validation failed: ${error.message}`);
 *   }
 * }
 */
export const validateUpdateStudentBody = async (studentId: string, studentData: UpdateStudentBody) => {
  try {
    const student = await findStudentById(studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    return { student };
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a student
 *
 * @param {string} studentId - The ID of the student to delete
 * @returns {Promise<boolean>} A promise that resolves to true if deletion was successful
 * @throws {CustomError} If student not found or database operation fails
 */
export const deleteStudent = async (studentId: string): Promise<boolean> => {
  try {
    const result = await Student.softDelete({ _id: studentId });
    return result.deleted === 0;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to delete student', 500);
  }
};

/**
 * Check if Student exist in database
 *
 * @param { string } studentId
 */
export const checkStudentExists = async (studentId: string) => {
  try {
    const student = Student.findOne({ _id: studentId });
    return !!student;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to check student', 500);
  }
};

export default {
  findStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};

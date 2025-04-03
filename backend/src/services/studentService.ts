import mongoose from 'mongoose';

import Student, { IStudent } from 'src/models/student.model';

import { PostStudentBody, UpdateStudentBody } from 'src/shared/types/studentController.types';

import { CustomError } from 'src/shared/utils/CustomError';

export class StudentService {
  /**
   * Retrieve a specific student by ID
   * 
   * @param {string} studentId - The ID of the student to retrieve
   * @returns {Promise<IStudent>} A promise that resolves to the student
   * @throws {CustomError} If student not found or database operation fails
   */
  static getStudentById = async (studentId: string): Promise<IStudent> => {
    try {
      const student = await Student.findById(studentId);

      if (!student) {
        throw new Error('Student not found');
      }

      return student;
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
  static createStudent = async (studentData: PostStudentBody): Promise<IStudent> => {
    try {
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
   * Update an existing student
   * 
   * @param {string} studentId - The ID of the student to update
   * @param {UpdateStudentBody} studentData - The updated student data
   * @returns {Promise<IStudent>} A promise that resolves to the updated student
   * @throws {CustomError} If student not found or database operation fails
   */
  static updateStudent = async (studentId: string, studentData: UpdateStudentBody): Promise<IStudent> => {
    try {
      const student = await Student.findById(studentId);

      if (!student) {
        throw new Error('Student not found');
      }

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
 * Delete a student
 * 
 * @param {string} studentId - The ID of the student to delete
 * @returns {Promise<boolean>} A promise that resolves to true if deletion was successful
 * @throws {CustomError} If student not found or database operation fails
 */
  static deleteStudent = async (studentId: string): Promise<boolean> => {
    try {
      const result = await Student.deleteOne({ _id: studentId });

      if (result.deletedCount === 0) {
        throw new Error('Student not found');
      }

      return result.deletedCount > 0;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Failed to delete student', 500);
    }
  };
}
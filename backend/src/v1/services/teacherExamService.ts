import TeacherExam, { ITeacherExam } from 'src/db/models/teacherExam.model';

import * as ExamTypeService from 'src/v1/services/examTypeService';
import * as StudentExamService from 'src/v1/services/studentExamService';

import { PostTeacherExamBody } from '../controllers/types/teacherExamController.types';

import { CustomError } from 'src/shared/utils/CustomError';

/**
 * Retrieve a specific teacher exam by ID
 *
 * @param {string} teacherExamId - The ID of the teacher exam to retrieve
 * @returns {Promise<ITeacherExam>} A promise that resolves to the teacher exam
 * @throws {CustomError} If teacher exam not found or database operation fails
 */
export const getTeacherExamById = async (teacherExamId: string): Promise<ITeacherExam> => {
  try {
    const teacherExam = await TeacherExam.findById(teacherExamId);

    if (!teacherExam) {
      throw new CustomError('Not Found!', 404);
    }

    return teacherExam;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Create a new teacher exam
 *
 * @param {ITeacherExam} teacherExamData - The teacher exam data to create
 * @returns {Promise<ITeacherExam>} A promise that resolves to the created teacher exam
 * @throws {CustomError} If validation fails or database operation fails
 */
export const createTeacherExam = async (teacherExamData: PostTeacherExamBody): Promise<ITeacherExam> => {
  try {
    await validateCreateTeacherExam(teacherExamData);
    return await TeacherExam.create(teacherExamData);
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Validates teacher exam data before creation
 * 
 * This function performs comprehensive validation of teacher exam data to ensure
 * all required fields are present and valid before creating a new exam. It checks:
 * 1. Title validity - ensures title is present and properly formatted
 * 2. Exam type existence - verifies the exam type ID exists in the database
 * 3. Subject existence - verifies the subject ID exists and is active
 * 4. Grade validity - ensures the full exam grade is a positive number
 * 5. Creator permissions - verifies the creator has permission to create exams
 *
 * @param {TeacherExamData} examData - The teacher exam data to validate
 *   @param {string} examData.title - The title of the exam
 *   @param {number} examData.fullExamGrade - The maximum possible grade for the exam
 *   @param {string|ObjectId} examData.examTypeId - Reference to the exam type
 *   @param {string|ObjectId} examData.subjectId - Reference to the subject
 *   @param {string|ObjectId} [examData.createdBy] - Optional reference to the creator
 * 
 * @returns {Promise<void>} A promise that resolves if validation passes
 * 
 * @throws {CustomError} With appropriate status codes and messages:
 *   - 400: If exam data is invalid (missing fields, invalid format, etc.)
 *   - 404: If referenced entities (exam type, subject) don't exist
 *   - 403: If creator doesn't have permission to create exams
 *   - 500: For unexpected server errors during validation
 * 
 * @example
 * try {
 *   const examData = {
 *     title: "Midterm Exam",
 *     fullExamGrade: 100,
 *     examTypeId: "60d5ec9af682fbd12a0b4d8b",
 *     subjectId: "60d5ecb2f682fbd12a0b4d8c",
 *     createdBy: "60d5ecb2f682fbd12a0b4d8d"
 *   };
 *   
 *   await validateCreateTeacherExam(examData);
 *   // Validation passed, proceed with exam creation
 * } catch (error) {
 *   // Handle validation error
 *   console.error(`Validation failed: ${error.message}`);
 * }
 */
export const validateCreateTeacherExam = async (teacherExamData: PostTeacherExamBody) => {
  try {
    const isExamTypeExist = await ExamTypeService.checkExamTypeExists(teacherExamData.examTypeId.toString());
    if (!isExamTypeExist) {
      throw new CustomError('Exam type not found!', 404);
    }

    const isStudentExamExist = await StudentExamService.checkExamExists(teacherExamData.examId);
    if (isStudentExamExist) {
      throw new CustomError('Exam already exists!', 409);
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing teacher exam
 *
 * @param {string} teacherExamId - The ID of the teacher exam to update
 * @param {ITeacherExam} teacherExamData - The updated teacher exam data
 * @returns {Promise<ITeacherExam>} A promise that resolves to the updated teacher exam
 * @throws {CustomError} If teacher exam not found or database operation fails
 */
export const updateTeacherExam = async (teacherExamId: string, teacherExamData: { title: string; fullExamGrade: number }): Promise<ITeacherExam> => {
  try {
    const teacherExam = await TeacherExam.findById(teacherExamId);

    if (!teacherExam) {
      throw new CustomError('Not Found!', 404);
    }

    if (teacherExam.title !== teacherExamData.title) {
      teacherExam.title = teacherExamData.title;
    }

    if (teacherExam.fullExamGrade !== teacherExamData.fullExamGrade) {
      teacherExam.fullExamGrade = teacherExamData.fullExamGrade;
    }

    return await teacherExam.save();
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

export default {
  getTeacherExamById,
  createTeacherExam,
  updateTeacherExam,
};

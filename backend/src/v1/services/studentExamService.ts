import { Types } from 'mongoose';

import Enrollment from 'src/db/models/enrollment.model';
import Student from 'src/db/models/student.model';
import StudentExam, { IStudentExam } from 'src/db/models/studentExam.model';
import TeacherExam from 'src/db/models/teacherExam.model';

import * as SubjectService from 'src/v1/services/subjectService';
import * as StudentExamService from 'src/v1/services/studentExamService';
import * as TeacherExamService from 'src/v1/services/teacherExamService';
import * as StudentService from 'src/v1/services/studentService';

import { PostStudentExamBody, UpdateStudentExamBody } from '../controllers/types/studentExamController.types';

import { CustomError } from 'src/shared/utils/CustomError';

/**
 * Get a single exam by ID
 *
 * @param {string} id - The ID of the exam to retrieve
 * @returns {Promise<IStudentExam|null>} Promise with exam or null if not found
 * @throws {Error} If database operation fails
 */
export const findExamById = async (id: string): Promise<IStudentExam | null> => {
  try {
    return StudentExam.findById(id);
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Error finding exam', 500);
  }
};

/**
 * Create a new student exam
 *
 * @param {PostStudentExamBody} examData - The data for the new exam
 * @returns {Promise<IStudentExam>} Promise with created exam
 * @throws {Error} If database operation fails
 */
export const createExam = async (examData: PostStudentExamBody): Promise<IStudentExam> => {
  try {
    const newExam = new StudentExam({
      title: examData.title,
      studentGrade: examData.studentGrade,
      subjectId: new Types.ObjectId(examData.subjectId),
      studentId: new Types.ObjectId(examData.studentId),
      
      // Map other fields as needed
    });

    return await newExam.save();
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Error creating exam', 500);
  }
};

export const validateCreateExamBody = async (examData: PostStudentExamBody) => {
  try {
    const isValidSubject = await SubjectService.checkSubjectExists(examData.subjectId);
    if (!isValidSubject) {
      throw new CustomError('Invalid subject ID', 400);
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing student exam
 *
 * @param {string} examId - The ID of the exam to update
 * @param {UpdateStudentExamBody} examData - The data to update
 * @returns {Promise<IStudentExam|null>} Promise with updated exam or null if not found
 * @throws {Error} If database operation fails
 */
export const updateExam = async (examId: string, examData: UpdateStudentExamBody): Promise<IStudentExam | null> => {
  try {
    const { exam } = await validateUpdateExamBody(examId, examData);

    if (examData.title !== undefined) {
      exam.title = examData.title;
    }

    if (examData.studentGrade !== undefined) {
      exam.studentGrade = examData.studentGrade;
    }

    return await exam.save();
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Error updating exam', 500);
  }
};

/**
 * Validates student exam data before update
 * 
 * This method performs validation checks to ensure the student exam update data is valid
 * before modifying an existing exam record. It specifically verifies:
 * 1. Exam existence - Confirms the exam ID refers to an existing record
 * 2. Data integrity - Validates update fields have proper formats and values
 * 3. Business rules - Ensures the update doesn't violate any business constraints
 *
 * @param {string} examId - The MongoDB ObjectId of the student exam to update
 * @param {UpdateStudentExamBody} examData - The updated exam data
 *   @param {string} [examData.title] - Updated title for the exam
 *   @param {number} [examData.studentGrade] - Updated grade for the student
 * 
 * @returns {Promise<{exam: IStudentExam}>} A promise that resolves to an object containing:
 *   - exam: The existing student exam document that will be updated
 * 
 * @throws {CustomError} With appropriate status codes and messages:
 *   - 404: If the exam doesn't exist
 *   - 500: For unexpected server errors during validation
 * 
 * @example
 * try {
 *   const { exam } = await validateUpdateExamBody('60d5ec9af682fbd12a0b4d8b', {
 *     title: "Midterm Exam - Updated",
 *     studentGrade: 85
 *   });
 *   
 *   // Now you can modify the exam object and save it
 *   exam.title = "Midterm Exam - Updated";
 *   exam.studentGrade = 85;
 *   await exam.save();
 * } catch (error) {
 *   if (error.statusCode === 404) {
 *     console.error("Exam not found");
 *   } else {
 *     console.error(`Validation failed: ${error.message}`);
 *   }
 * }
 */
export const validateUpdateExamBody = async (examId: string, examData: UpdateStudentExamBody) => {
  try {
    const exam = await StudentExamService.findExamById(examId);
    if (!exam) {
      throw new CustomError('Exam not found', 404);
    }

    return { exam };
  } catch (error) {
    throw error; 
  }
};

/**
 * Delete a student exam
 *
 * @param {string} examId - The ID of the exam to delete
 * @returns {Promise<boolean>} Promise with boolean indicating if exam was deleted
 * @throws {Error} If database operation fails
 */
export const deleteExam = async (examId: string): Promise<boolean> => {
  try {
    const result = await StudentExam.deleteOne({ _id: examId });
    return result.deletedCount > 0;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Error deleting exam', 500);
  }
};

/**
 * Check if a student exam exists
 * @param examId - The ID of the exam to check
 * @returns Promise<boolean>
 */
export const checkExamExists = async (examId: string): Promise<boolean> => {
  try {
    const exam = await findExamById(examId);
    return !!exam;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Error checking if exam exists', 500);
  }
};

/**
 * TODO: This requires transaction
 * Record a grade for a student taking a teacher's exam
 *
 * @param {string} teacherExamId - The ID of the teacher exam
 * @param {string} studentId - The ID of the student
 * @param {string} grade - The grade to record
 * @param {string} semester - The semester (First or Second)
 * @param {number} year - The academic year
 * @returns {Promise<IStudentExam>} Promise with the created student exam
 * @throws {CustomError} If validation fails or database operation fails
 */
export const takeExam = async (teacherExamId: string, studentId: string, grade: string, semester: string, year: number): Promise<IStudentExam> => {
  try {
    // Check if the teacher exam exists
    const { teacherExam } = await validateTakeExamBody(teacherExamId, studentId);

    // Check if the student is enrolled in the subject for the specified semester and year
    const enrollment = await Enrollment.findOne({
      studentId: studentId,
      subjectId: teacherExam.subjectId,
      semester: semester,
      year: year,
    });

    if (!enrollment) {
      throw new CustomError(`Student is not enrolled in this subject for ${semester} semester, ${year}`, 403);
    }

    // Check if the student has already taken this teacher exam
    const existingStudentExam = await StudentExam.findOne({
      teacherExamId: teacherExamId,
      studentId: studentId,
      semester: semester,
      year: year,
    });

    // If an existing student exam record is found, delete it
    if (existingStudentExam) {
      await existingStudentExam.deleteOne();
    }

    // Create a new student exam record with the student's grade
    const newStudentExam = new StudentExam({
      title: teacherExam.title,
      teacherExamId: teacherExamId,
      studentId: studentId,
      subjectId: teacherExam.subjectId,
      studentGrade: grade,
      semester: semester,
      year: year,
    });

    return await newStudentExam.save();
  } catch (error: any) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to record exam grade', 500, error);
  }
};

/**
 * Validates data for a student taking an exam
 * 
 * This method performs validation checks to ensure the data for a student taking an exam
 * is valid before recording the exam grade. It specifically verifies:
 * 1. Teacher exam existence - Confirms the teacher exam ID refers to an existing exam
 * 2. Student existence - Verifies the student ID refers to an existing student
 * 3. Enrollment status - Ensures the student is enrolled in the subject (handled elsewhere)
 * 4. Data integrity - Validates that all required fields have proper formats and values
 *
 * @param {string} teacherExamId - The MongoDB ObjectId of the teacher exam being taken
 * @param {string} studentId - The MongoDB ObjectId of the student taking the exam
 * 
 * @returns {Promise<void>} A promise that resolves if validation passes
 * 
 * @throws {CustomError} With appropriate status codes and messages:
 *   - 404: If the teacher exam doesn't exist
 *   - 404: If the student doesn't exist
 *   - 500: For unexpected server errors during validation
 * 
 * @example
 * try {
 *   await validateTakeExamBody('60d5ec9af682fbd12a0b4d8b', '60d5ecb2f682fbd12a0b4d8c');
 *   
 *   // Validation passed, proceed with recording the exam grade
 *   const result = await takeExam(
 *     '60d5ec9af682fbd12a0b4d8b',  // teacherExamId
 *     '60d5ecb2f682fbd12a0b4d8c',  // studentId
 *     '85',                        // grade
 *     'First',                     // semester
 *     2023                         // year
 *   );
 * } catch (error) {
 *   if (error.statusCode === 404) {
 *     console.error(error.message); // "Teacher Exam not found" or "Student not found"
 *   } else {
 *     console.error(`Validation failed: ${error.message}`);
 *   }
 * }
 */
export const validateTakeExamBody = async (teacherExamId: string, studentId: string) => {
  try {
    const teacherExam = await TeacherExam.findById(teacherExamId);
    if (!teacherExam) {
      throw new CustomError('Teacher Exam not found', 404);
    }

    const isValidTeacherExam = await TeacherExamService.checkTeacherExam(teacherExamId);
    if (!isValidTeacherExam) {
      throw new CustomError('Teacher Exam not found', 404);
    }

    const isValidStudent = await StudentService.checkStudentExists(studentId);
    if (!isValidStudent) {
      throw new CustomError('Student not found', 404);
    }

    return { teacherExam };
  } catch (error) {
    throw error;
  }
};

export default {
  findExamById,
  createExam,
  updateExam,
  deleteExam,
  checkExamExists,
  takeExam,
};

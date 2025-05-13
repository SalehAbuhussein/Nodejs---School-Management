import { Types } from 'mongoose';

import StudentExam, { ICreateStudentExam, IStudentExam } from 'src/db/models/studentExam.model';
import Enrollment from 'src/db/models/enrollment.model';
import TeacherExam from 'src/db/models/teacherExam.model';
import Student from 'src/db/models/student.model';

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
 * @param {ICreateStudentExam} examData - The data for the new exam
 * @returns {Promise<IStudentExam>} Promise with created exam
 * @throws {Error} If database operation fails
 */
export const createExam = async (examData: ICreateStudentExam): Promise<IStudentExam> => {
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

/**
 * Update an existing student exam
 *
 * @param {string} examId - The ID of the exam to update
 * @param {Omit<ICreateStudentExam, 'studentId' | 'subjectId'>} examData - The data to update
 * @returns {Promise<IStudentExam|null>} Promise with updated exam or null if not found
 * @throws {Error} If database operation fails
 */
export const updateExam = async (examId: string, examData: Omit<ICreateStudentExam, 'studentId' | 'subjectId' | 'semester' | 'year'>): Promise<IStudentExam | null> => {
  try {
    const exam = await StudentExam.findById(examId);

    if (!exam) {
      return null;
    }

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
 * Delete a student exam
 *
 * @param {string} examId - The ID of the exam to delete
 * @returns {Promise<boolean>} Promise with boolean indicating if exam was deleted
 * @throws {Error} If database operation fails
 */
export const deleteExam = async (examId: string): Promise<boolean> => {
  try {
    const result = await StudentExam.deleteOne({ _id: examId });

    if (result.deletedCount === 0) {
      throw new CustomError('Exam not found', 404);
    }

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
    const count = await StudentExam.countDocuments({ _id: examId });
    return count > 0;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Error checking if exam exists', 500);
  }
};

/**
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
    const teacherExam = await TeacherExam.findById(teacherExamId);
    if (!teacherExam) {
      throw new CustomError('Teacher Exam not found', 404);
    }

    // Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      throw new CustomError('Student not found', 404);
    }

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

export default {
  findExamById,
  createExam,
  updateExam,
  deleteExam,
  examExists: checkExamExists,
  takeExam,
};

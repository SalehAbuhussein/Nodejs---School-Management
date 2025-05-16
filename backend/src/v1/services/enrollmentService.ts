import mongoose, { ClientSession } from 'mongoose';

import Enrollment, { IEnrollment } from 'src/db/models/enrollment.model';
import Subject from 'src/db/models/subject.model';

import *  as StudentService from './studentService';
import * as EnrollmentService from './enrollmentService';
import * as SubjectService from './subjectService';

import { PostEnrollmentBody } from 'src/v1/controllers/types/enrollmentController.types';

import { CustomError } from 'src/shared/utils/CustomError';

/**
 * Get enrollment by ID
 *
 * @param {string} enrollmentId - The enrollment ID
 * @returns {Promise<IEnrollment|null>} Promise with enrollment or null if not found
 * @throws {Error} If database operation fails
 */
export const getEnrollmentById = async (enrollmentId: string, session?: ClientSession): Promise<IEnrollment | null> => {
  try {
    const query = { _id: enrollmentId, isDeleted: false };
    const options = session ? { session } : {};

    return await Enrollment.findOne(query, {}, options)
      .populate('subjectId')
      .populate('studentId');
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to get enrollment', 500);
  }
};

/**
 * Enroll a student in a subject
 *
 * @param {PostEnrollmentBody} enrollmentData - The enrollment data
 * @returns {Promise<Enrollment>} Promise with the created enrollment
 * @throws {Error} If database operation fails
 */
export const enrollStudent = async (enrollmentData: PostEnrollmentBody): Promise<IEnrollment> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { studentId, subjectId, enrollmentFees, enrollmentDate = new Date(), semester = 'First' } = enrollmentData;
    await validateEnrollStudentBody(enrollmentData);

    const enrollment = await Enrollment.create(
      [
        {
          studentId,
          subjectId,
          enrollmentFees,
          enrollmentDate,
          semester,
          year: enrollmentDate.getFullYear(),
        },
      ],
      { session },
    );

    await Subject.findByIdAndUpdate(
      subjectId,
      {
        $inc: { currentSlots: 1 },
      },
      { new: true, runValidators: true, session },
    );

    await session.commitTransaction();
    return enrollment[0];
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to enroll student', 500);
  } finally {
    await session.abortTransaction();
    await session.endSession();
  }
};

/**
 * Validates all prerequisites and conditions for student enrollment in a subject
 * 
 * This function performs a comprehensive validation of all conditions that must be met
 * before a student can be enrolled in a subject. It checks:
 * 1. Student existence - verifies the student ID is valid
 * 2. Subject existence - verifies the subject ID is valid
 * 3. Subject status - checks if the subject is active and not locked
 * 4. Capacity - ensures the subject has available slots
 * 5. Duplicate enrollment - prevents enrolling the same student twice
 * 6. Enrollment data validity - validates fees, dates, and other enrollment details
 *
 * @param {PostEnrollmentBody} enrollmentData - Complete enrollment data including:
 *   - studentId: MongoDB ObjectId of the student
 *   - subjectId: MongoDB ObjectId of the subject
 *   - enrollmentFees: Amount to be paid for enrollment
 *   - enrollmentDate: (Optional) Date of enrollment
 *   - semester: (Optional) 'First' or 'Second' semesterass
 * @throws {CustomError} With appropriate status codes and messages:
 *   - 404: If student or subject is not found
 *   - 400: If subject is inactive, locked, full, or student is already enrolled
 *   - 400: If enrollment data is invalid (negative fees, invalid date, etc.)
 *   - 500: For unexpected server errors during validation
 * @example
 * try {
 *   const enrollmentData = {
 *     studentId: '60d5ec9af682fbd12a0b4d8b',
 *     subjectId: '60d5ecb2f682fbd12a0b4d8c',
 *     enrollmentFees: 500,
 *     semester: 'First'
 *   };
 *   await handleEnrollValidation(enrollmentData);
 *   // All validations passed, proceed with enrollment
 * } catch (error) {
 *   // Handle specific validation failure with error.message and error.statusCode
 * }
 */
export const validateEnrollStudentBody = async (enrollmentData: PostEnrollmentBody): Promise<void> => {
  const { studentId, subjectId } = enrollmentData;

  const isStudentExist = await StudentService.checkStudentExists(studentId);
  if (!isStudentExist) {
    throw new CustomError('Student not found', 404);
  }

  const isSubjectAvailable = await SubjectService.checkSubjectIsAvailable(subjectId);
  if (!isSubjectAvailable) {
    throw new CustomError('Subject is not available', 400);
  }

  const isUserEnrolledBefore = await EnrollmentService.checkDuplicateEnrollment(studentId, subjectId);
  if (isUserEnrolledBefore) {
    throw new CustomError('Student already enrolled in this subject', 400);
  }
};

/**
 * Unenroll a student from a subject
 *
 * @param {string} enrollmentId - The ID of the enrollment to remove
 * @returns {Promise<{success: boolean, message: string}>} Promise with result object
 * @throws {Error} If database operation fails
 */
export const unenrollStudent = async (enrollmentId: string): Promise<{ success: boolean; message: string } | undefined> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { subject } = await validateUnenrollBody(enrollmentId, session);
    await Enrollment.softDelete({ _id: enrollmentId }, { session });

    if (subject.currentSlots > 0) {
      await Subject.findByIdAndUpdate(
        subject._id,
        {
          $inc:  { currentSlots: -1 },
          $set: { isLocked: false },
        },
        { session }
      );
    }

    await session.commitTransaction();
    return { success: true, message: 'You have unenrolled successfully' };
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to unenroll student', 500);
  } finally {
    await session.abortTransaction();
    await session.endSession();
  }
};

/**
 * Validate an unenrollment request
 * 
 * This helper method checks if the enrollment exists and if the subject
 * allows unenrollment (not locked). It's used as part of the unenrollment process.
 *
 * @param {string} enrollmentId - The MongoDB ObjectId of the enrollment
 * @param {mongoose.ClientSession} session - The MongoDB session for transaction
 * @throws {CustomError} If validation fails with appropriate status code and message
 * @private
 */
export const validateUnenrollBody = async (enrollmentId: string, session: ClientSession) => {
  try {
    const enrollment = await EnrollmentService.checkEnrollmentExist(enrollmentId, session);
    if (!enrollment) {
      throw new CustomError('Enrollment not found', 404);
    }

    const subject = await Subject.where('isActive')
      .equals(true)
      .findById(enrollment.subjectId)
      .session(session);
    if (!subject) {
      throw new CustomError('Subject not found', 404);
    }

    // Check if subject allows unenrollment
    if (subject.isLocked) {
      throw new CustomError('Subject is not available for enrollment', 400);
    }

    return { subject };
  } catch (error) {
    throw error;
  } finally {
    await session.abortTransaction();
    await session.endSession();
  }
};

/**
 * Check if a student is enrolled in a subject
 *
 * @param {string} studentId - The student ID
 * @param {string} subjectId - The subject ID
 * @returns {Promise<boolean>} Promise with boolean indicating if student is enrolled
 * @throws {Error} If database operation fails
 */
export const isStudentEnrolled = async (studentId: string, subjectId: string): Promise<boolean> => {
  try {
    const enrollment = await Enrollment.where('isDeleted').equals(false).findOne({ studentId, subjectId });
    return !!enrollment;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to check enrollment', 500);
  }
};

/**
 * Retrieve all enrollments for a specific student
 *
 * @param {string} studentId - The ID of the student whose enrollments to retrieve
 * @param {ClientSession} [session] - Optional MongoDB session for transactions
 * @param {number} [year=current year] - The academic year to filter enrollments by
 * @param {'First' | 'Second'} [semester='First'] - The semester to filter enrollments by
 * @returns {Promise<IEnrollment[]>} A promise that resolves to an array of student enrollments
 * @throws {CustomError} If database operation fails
 */
export const getStudentEnrollments = async (
    studentId: string,
    session?: ClientSession,
    year: number = new Date().getFullYear(),
    semester: 'First' | 'Second' = 'First'
  ): Promise<IEnrollment[]> => {
  try {
    const query = { isDeleted: false, id: studentId, semester, year };
    const options = session ? { session } : {};

    return await Enrollment.find(query, {}, options).populate('subjectId');
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to get enrollments', 500);
  }
};

/**
 * Check if a subject has available slots
 *
 * @param {string} subjectId - The subject ID
 * @returns {Promise<boolean>} Promise with boolean indicating if subject has available slots
 * @throws {Error} If database operation fails
 */
export const hasAvailableSlots = async (subjectId: string): Promise<boolean> => {
  try {
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return false;
    }

    return subject.currentSlots < subject.totalSlots;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to check available slots', 500);
  }
};

/**
 * Check if enrollment exists
 */
export const checkEnrollmentExist = async (enrollmentId: string, session?: ClientSession) => {
  try {
    if (session) {
      return await Enrollment.where('isDeleted').equals(false).findById({ _id: enrollmentId }).session(session);
    }

    return await Enrollment.where('isDeleted').equals(false).findById({ _id: enrollmentId });
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to check enrollment exist', 500, error);
  }
};

/**
 * Check Duplicate Enrollment by student id and subject id
 *
 * @param { string } studentId
 * @param { string } subjectId
 */
export const checkDuplicateEnrollment = async (studentId: string, subjectId: string) => {
  try {
    const enrollment = await Enrollment.where('isDeleted').equals(false).findOne({ studentId, subjectId });
    return !!enrollment;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to check duplicate enrollment', 500, error);
  }
};

export default {
  getEnrollmentById,
  enrollStudent,
  unenrollStudent,
  isStudentEnrolled,
  getStudentEnrollments,
  hasAvailableSlots,
};

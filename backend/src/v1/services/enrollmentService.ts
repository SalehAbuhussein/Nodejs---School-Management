import mongoose from 'mongoose';

import Enrollment, { IEnrollment } from 'src/db/models/enrollment.model';
import Subject from 'src/db/models/subject.model';

import { PostEnrollmentBody } from 'src/v1/controllers/types/enrollmentController.types';

import { CustomError } from 'src/shared/utils/CustomError';

/**
 * Get enrollment by ID
 *
 * @param {string} enrollmentId - The enrollment ID
 * @returns {Promise<IEnrollment|null>} Promise with enrollment or null if not found
 * @throws {Error} If database operation fails
 */
export const getEnrollmentById = async (enrollmentId: string): Promise<IEnrollment | null> => {
  try {
    return await Enrollment.where('isDeleted').equals(false).findById(enrollmentId).populate('subjectId');
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
        $push: { enrollments: enrollment[0]._id },
      },
      { new: true, runValidators: true, session },
    );

    await session.commitTransaction();
    return enrollment[0];
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to enroll student', 500);
  } finally {
    await session.endSession();
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
    const enrollment = await Enrollment.where('isDeleted').equals(false).findOne({ _id: enrollmentId }).session(session);

    if (!enrollment) {
      await session.abortTransaction();
      return { success: false, message: 'Enrollment not found' };
    }

    const subject = await Subject.where('isActive').equals(true).findOne({ _id: enrollment.subjectId }).session(session);

    if (!subject) {
      await session.abortTransaction();
      return { success: false, message: 'Subject not found' };
    }

    if (subject.isLocked) {
      await session.abortTransaction();
      return { success: false, message: 'Subject is not available for enrollment' };
    }

    // Soft delete the enrollment
    await Enrollment.softDelete({ _id: enrollmentId }, { session });

    // Update the subject
    if (subject.currentSlots > 0) {
      subject.enrollments = subject.enrollments.filter(id => !id.equals(enrollment.id));
      subject.currentSlots -= 1;
      subject.isLocked = false;

      await subject.save({ session });
    }

    await session.commitTransaction();
    return { success: true, message: 'You have unenrolled successfully' };
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to unenroll student', 500);
  } finally {
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

export const getStudentEnrollments = async (studentId: string): Promise<IEnrollment[]> => {
  try {
    return await Enrollment.where('isDeleted').equals(false).find({ studentId }).populate('subjectId');
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
export const checkEnrollmentExist = async (enrollmentId: string) => {
  try {
    const enrollment = await Enrollment.where('isDeleted').equals(false).findOne({ _id: enrollmentId });
    return !!enrollment;
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

import mongoose from "mongoose";

import Enrollment from 'src/models/enrollment.model';
import Subject from 'src/models/subject.model';

import { PostEnrollmentBody } from "src/shared/types/enrollmentController.types";

export class EnrollmentService {
  /**
   * Get enrollment by ID
   * @param enrollmentId - The enrollment ID
   * @returns Promise with enrollment or null if not found
   */
  static getEnrollmentById = async (enrollmentId: string) => {
    return await Enrollment
      .where('isDeleted')
      .equals(false)
      .findById(enrollmentId)
      .populate('subjectId');
  };

  /**
   * Enroll a student in a subject
   * @param enrollmentData - The enrollment data
   * @returns Promise with the created enrollment
   */ 
  static enrollStudent = async (enrollmentData: PostEnrollmentBody) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { studentId, subjectId, enrollmentFees, enrollmentDate = new Date(), semester = 'First' } = enrollmentData;

      const enrollment = await Enrollment.create([{
        studentId,
        subjectId,
        enrollmentFees,
        enrollmentDate,
        semester,
        year: enrollmentDate.getFullYear(),
      }], { session });

      await Subject.findByIdAndUpdate(
        subjectId, 
        { 
          $inc: { currentSlots: 1 },
          $push: { enrollments: enrollment[0]._id }
        },
        { new: true, runValidators: true, session },
      );

      await session.commitTransaction();
      return enrollment[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };

  /**
   * Unenroll a student from a subject
   * @param enrollmentId - The ID of the enrollment to remove
   * @returns Promise with boolean indicating success
   */
  static unenrollStudent = async (enrollmentId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const enrollment = await Enrollment
      .where('isDeleted')
      .equals(false)
      .findOne({ _id: enrollmentId })
      .session(session);

      if (!enrollment) {
        await session.abortTransaction();
        return { success: false, message: 'Enrollment not found' };
      }

      const subject = await Subject
        .where('isActive')
        .equals(true)
        .findOne({ _id: enrollment.subjectId })
        .session(session);

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
    } finally {
      await session.endSession();
    }
  };

  /**
   * Check if a student is enrolled in a subject
   * @param studentId - The student ID
   * @param subjectId - The subject ID
   * @returns Promise with boolean indicating if student is enrolled
   */
  static isStudentEnrolled = async (studentId: string, subjectId: string) => {
    const enrollment = await Enrollment
      .where('isDeleted')
      .equals(false)
      .findOne({ studentId, subjectId });

    return !!enrollment;
  };

  /**
   * Get all enrollments for a student
   * @param studentId - The student ID
   * @returns Promise with array of enrollments
   */
  static getStudentEnrollments = async (studentId: string) => {
    return await Enrollment
      .where('isDeleted')
      .equals(false)
      .find({ studentId })
      .populate('subjectId');
  };

  /**
   * Check if a subject has available slots
   * @param subjectId - The subject ID
   * @returns Promise with boolean indicating if subject has available slots
   */
  static hasAvailableSlots = async (subjectId: string) => {
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return false;
    }

    return subject.currentSlots < subject.totalSlots;
  };
};
import mongoose from 'mongoose';

import Subject, { ISubject } from 'src/db/models/subject.model';
import Teacher from 'src/db/models/teacher.model';
import TeacherSubject from 'src/db/models/teacherSubject.model';

import { PostSubjectBody, UpdateSubjectBody } from 'src/v1/controllers/types/subjectController.types';

import { CustomError } from 'src/shared/utils/CustomError';

/**
 * Retrieve all subjects from the database
 *
 * @returns {Promise<ISubject[]>} A promise that resolves to an array of subjects
 * @throws {CustomError} If database operation fails
 */
export const getAllSubjects = async (): Promise<ISubject[]> => {
  try {
    return await Subject.find();
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Retrieve a specific subject by ID
 *
 * @param {string} subjectId - The ID of the subject to retrieve
 * @returns {Promise<ISubject>} A promise that resolves to the subject
 * @throws {CustomError} If subject not found or database operation fails
 */
export const getSubjectById = async (subjectId: string): Promise<ISubject> => {
  try {
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      throw new CustomError('Subject Not Found', 404);
    }

    return subject;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

// TODO: Check if it works
/**
 * Get teachers for a specific subject
 * 
 * @param {string} subjectId - The ID of the subject
 * @param {string} semester - The semester ('First' or 'Second')
 * @returns {Promise<any[]>} A promise that resolves to an array of teachers
 * @throws {CustomError} If operation fails
 */
export const getSubjectTeachers = async (subjectId: string, semester: 'First' | 'Second') => {
  try {
    const assignments = await TeacherSubject.where('isDeleted')
      .equals(false)
      .find({
        subjectId,
        semester,
        isActive: true,
      })
      .populate({
        path: 'teacherId',
        populate: {
          path: 'userId',
          select: 'name email profileImg'
        }
      });

      return assignments.map(assignment => assignment.teacherId);
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to get subject teachers', 500, error);
  }
};

/**
 * Create a new subject and associate it with a teacher
 *
 * @param {PostSubjectBody} subjectData - The subject data to create
 * @returns {Promise<ISubject>} A promise that resolves to the created subject
 * @throws {CustomError} If validation fails, teacher not found, or database operation fails
 */
export const createSubject = async (subjectData: PostSubjectBody): Promise<ISubject> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const totalSlotsNumber = parseInt(subjectData.totalSlots);
    const newSubject = await new Subject(
      {
        name: subjectData.name,
        totalSlots: totalSlotsNumber,
      },
      null,
      { session },
    ).save({ session });

    const teacher = await Teacher.findById(subjectData.teacherId).session(session);

    if (!teacher) {
      await session.abortTransaction();
      throw new CustomError('Teacher Not Found', 404);
    }

    const currentMonth = new Date().getMonth();
    const semester = currentMonth < 6 ? 'First' : 'Second';

    await TeacherSubject.create([
      {
        teacherId: subjectData.teacherId,
        subjectId: newSubject._id,
        semester,
      }
    ], { session })

    await session.commitTransaction();

    return newSubject;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  } finally {
    await session.abortTransaction();
    await session.endSession();
  }
};

/**
 * Update an existing subject
 *
 * @param {string} subjectId - The ID of the subject to update
 * @param {Omit<UpdateSubjectBody, 'totalSlots'>} subjectData - The updated subject data
 * @returns {Promise<ISubject>} A promise that resolves to the updated subject
 * @throws {CustomError} If subject not found or database operation fails
 */
export const updateSubject = async (subjectId: string, subjectData: Omit<UpdateSubjectBody, 'totalSlots'>): Promise<ISubject> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let subject = await Subject.findById(subjectId).session(session);

    if (!subject) {
      throw new CustomError('Subject Not Found', 404);
    }

    if (subjectData.name !== subject.name) {
      subject.name = subjectData.name;
    }

    if (subjectData.isActive !== subject.isActive) {
      subject.isActive = subjectData.isActive;
    }

    return await subject.save({ session });;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  } finally {
    await session.abortTransaction();
    await session.endSession();
  }
};

/**
 * Delete a subject
 *
 * @param {string} subjectId - The ID of the subject to delete
 * @returns {Promise<boolean>} A promise that resolves to true if deletion was successful
 * @throws {CustomError} If subject not found or database operation fails
 */
export const deleteSubject = async (subjectId: string): Promise<boolean> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const subject = await Subject.deleteOne({ _id: subjectId });
    return subject.deletedCount > 0;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Check if Subject exist in database
 *
 * @param { string } subjectId
 */
export const checkSubjectExists = async (subjectId: string) => {
  try {
    const subject = await getSubjectById(subjectId);
    return !!subject;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Check if Subject exist in database
 *
 * @param { string[] } subjectesIds subject ids
 */
export const checkSubjectsExists = async (subjectesIds: string[]) => {
  try {
    const subjects = await Subject.find({ _id: { $in: subjectesIds } });
    return subjects.length != subjectesIds.length;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

/**
 * Check if Subject is available to be enrolled at
 *
 * @param { string } subjectId
 */
export const checkSubjectIsAvailable = async (subjectId: string) => {
  try {
    const subject = await getSubjectById(subjectId);
    return subject.isLocked;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
  }
};

export default {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};

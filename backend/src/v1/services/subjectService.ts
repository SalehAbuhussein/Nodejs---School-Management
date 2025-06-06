import mongoose, { ClientSession } from 'mongoose';

import Subject, { ISubject } from 'src/db/models/subject.model';
import TeacherSubject from 'src/db/models/teacherSubject.model';

import TeacherService from './teacherService';
import TeacherSubjectService from './teacherSubjectService';

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
export const getSubjectById = async (subjectId: string, session?: ClientSession): Promise<ISubject | null> => {
  try {
    if (session) {
      return await Subject.findById(subjectId).session(session);
    }

    return await Subject.findById(subjectId);
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Server Error', 500, error);
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
    const teacher = await TeacherService.getTeacherById(subjectData.teacherId, session);;
    if (!teacher) {
      throw new CustomError('Teacher Not Found', 404);
    }

    const totalSlotsNumber = parseInt(subjectData.totalSlots);
    const newSubject = await new Subject(
      {
        name: subjectData.name,
        totalSlots: totalSlotsNumber,
      },
      null,
      { session },
    ).save({ session });

    const currentMonth = new Date().getMonth();
    const semester = currentMonth < 6 ? 'First' : 'Second';

    // link teacher to subject
    await TeacherSubjectService.assignTeacherToSubject({
      teacherId: subjectData.teacherId,
      subjectId: newSubject.id,
      semester,
    }, session);


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
    let subject = await getSubjectById(subjectId, session);
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
  try {
    const subject = await Subject.softDelete({ _id: subjectId });
    return subject.deleted === 1;
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
    return subject && subject.isLocked;
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

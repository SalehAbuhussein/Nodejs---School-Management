import mongoose from "mongoose";

import Subject, { ISubject } from "src/models/subject.model";
import Teacher from 'src/models/teacher.model';

import { PostSubjectBody, UpdateSubjectBody } from "src/shared/types/subjectController.types";

import { CustomError } from "src/shared/utils/CustomError";

export class SubjectService {
  /**
   * Retrieve all subjects from the database
   * 
   * @returns {Promise<ISubject[]>} A promise that resolves to an array of subjects
   * @throws {CustomError} If database operation fails
   */
  static getAllSubjects = async (): Promise<ISubject[]> => {
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
  static getSubjectById = async (subjectId: string): Promise<ISubject> => {
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

  /**
   * Create a new subject and associate it with a teacher
   * 
   * @param {PostSubjectBody} subjectData - The subject data to create
   * @returns {Promise<ISubject>} A promise that resolves to the created subject
   * @throws {CustomError} If validation fails, teacher not found, or database operation fails
   */
  static createSubject = async (subjectData: PostSubjectBody): Promise<ISubject> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const totalSlotsNumber = parseInt(subjectData.totalSlots);
      const newSubject = await new Subject({
        name: subjectData.name,
        teachers: [subjectData.teacherId],
        totalSlots: totalSlotsNumber,
      }, null, { session }).save({ session });

      const teacher = await Teacher.findById(subjectData.teacherId).session(session);

      if (!teacher) {
        await session.abortTransaction();
        throw new CustomError('Teacher Not Found', 404);
      }

      if (!teacher.subjects.includes(newSubject._id)) {
        teacher.subjects.push(newSubject._id);
        await teacher.save({ session });
      }

      await session.commitTransaction();

      return newSubject;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Server Error', 500, error);
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
  static updateSubject = async (subjectId: string, subjectData: Omit<UpdateSubjectBody, 'totalSlots'>): Promise<ISubject> => {
    try {
      let subject = await Subject.findById(subjectId);

      if (!subject) {
        throw new CustomError('Subject Not Found', 404);
      }

      if (subjectData.name !== subject.name) {
        subject.name = subjectData.name;
      }

      if (subjectData.isActive !== subject.isActive) {
        subject.isActive = subjectData.isActive;
      }

      if (subjectData.teachersIds && subjectData.teachersIds.length > 0) {
        // Use Mongoose's $addToSet to add teachers, ensuring no duplicates
        subject = await Subject.findByIdAndUpdate(
          subjectId,
          { $addToSet: { teachers: { $each: subjectData.teachersIds } } }, // $each allows adding multiple teachers at once
          { new: true } // Return the updated subject document
        );  
      }

      return await subject!.save();
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Server Error', 500, error);
    }
  };

  /**
   * Delete a subject
   * 
   * @param {string} subjectId - The ID of the subject to delete
   * @returns {Promise<boolean>} A promise that resolves to true if deletion was successful
   * @throws {CustomError} If subject not found or database operation fails
   */
  static deleteSubject = async (subjectId: string): Promise<boolean> => {
    try {
      const subject = await Subject.deleteOne({ _id: subjectId });

      if (subject.deletedCount === 0) {
        throw new CustomError('Subject Not Found', 404);
      }

      return subject.deletedCount > 0;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Server Error', 500, error);
    }
  };
}
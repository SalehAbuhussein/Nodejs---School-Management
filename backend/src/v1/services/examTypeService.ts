import { ClientSession } from 'mongoose';
import ExamType, { IExamType } from 'src/db/models/examType.model';

import { CustomError } from 'src/shared/utils/CustomError';
import { UpdateExamTypeBody } from '../controllers/types/examTypeController.types';

/**
 * Retrieve a specific exam type by ID
 *
 * @param {string} examTypeId - The ID of the exam type to retrieve
 * @param {ClientSession} session - Optional session for database operations
 * @returns {Promise<IExamType|null>} A promise that resolves to the exam type or null if not found
 * @throws {Error} If database operation fails
 */
export const findExamTypeById = async (examTypeId: string, session?: ClientSession): Promise<IExamType | null> => {
  try {
    if (session) {
      return await ExamType.findById(examTypeId, { }, { session });
    }

    return await ExamType.findById(examTypeId);
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to retrieve exam type', 500, error);
  }
};

/**
 * Create a new exam type
 *
 * @param {string} name - The name of the exam type to create
 * @returns {Promise<IExamType>} A promise that resolves to the created exam type
 * @throws {Error} If validation fails or database operation fails
 */
export const createExamType = async (name: string): Promise<IExamType> => {
  try {
    return await ExamType.create({ name });
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to create exam type', 500, error);
  }
};

/**
 * Update an existing exam type
 *
 * @param {string} examTypeId - The ID of the exam type to update
 * @param {IExamType} examTypeData - The updated exam type data
 * @returns {Promise<IExamType|null>} A promise that resolves to the updated exam type or null if not found
 * @throws {CustomError} If validation fails or database operation fails
 */
export const updateExamType = async (examTypeId: string, examTypeData: UpdateExamTypeBody): Promise<IExamType | null> => {
  try {
    const { examType } = await validateUpdateExamTypeBody(examTypeId, examTypeData);

    // Check if updating to a name that already exists
    if (examTypeData.name !== undefined && examTypeData.name !== examType.name) {
      const existingExamType = await ExamType.findOne({ name: examTypeData.name });

      if (existingExamType) {
        throw new CustomError(`Exam type with name "${examTypeData.name}" already exists`, 400);
      }

      examType.name = examTypeData.name;
    }

    return await examType.save();
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to update exam type', 500, error);
  }
};

/**
 * Validates exam type data before update
 * 
 * This method verifies that the exam type to be updated exists in the database
 * before proceeding with the update operation. It retrieves the current exam type
 * document which can then be used for the update process.
 *
 * @param {string} examTypeId - The MongoDB ObjectId of the exam type to update
 * @param {UpdateExamTypeBody} examTypeData - The updated exam type data
 *   @param {string} [examTypeData.name] - Updated name for the exam type
 * 
 * @returns {Promise<{examType: IExamType}>} A promise that resolves to an object containing:
 *   - examType: The existing exam type document that will be updated
 * 
 * @throws {CustomError} With appropriate status codes and messages:
 *   - 404: If the exam type doesn't exist
 *   - 500: For unexpected server errors during validation
 * 
 * @example
 * try {
 *   const { examType } = await validateUpdateExamTypeBody('60d5ec9af682fbd12a0b4d8b', {
 *     name: "Final Exam"
 *   });
 *   
 *   // Now you can modify the examType object and save it
 *   examType.name = "Final Exam";
 *   await examType.save();
 * } catch (error) {
 *   if (error.statusCode === 404) {
 *     console.error("Exam type not found");
 *   } else {
 *     console.error(`Validation failed: ${error.message}`);
 *   }
 * }
 */
export const validateUpdateExamTypeBody = async (examTypeId: string, examTypeData: UpdateExamTypeBody) => {
  try {
    const examType = await ExamType.findById(examTypeId);
    if (!examType) {
      throw new CustomError('Exam type not found', 404);
    }

    return { examType };
  } catch (error) {
    throw error;
  }
};

/**
 * Delete an exam type
 *
 * @param {string} examTypeId - The ID of the exam type to delete
 * @returns {Promise<boolean>} A promise that resolves to true if deletion was successful
 * @throws {CustomError} If exam type not found or database operation fails
 */
export const deleteExamType = async (examTypeId: string): Promise<boolean> => {
  try {
    const result = await ExamType.deleteOne({ _id: examTypeId });

    if (result.deletedCount === 0) {
      throw new CustomError('Exam type not found', 404);
    }

    return result.deletedCount > 0;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to delete exam type', 500, error);
  }
};

/**
 * Check if an exam type exists
 *
 * @param {string} examTypeId - The ID of the exam type to check
 * @returns {Promise<boolean>} A promise that resolves to true if the exam type exists
 * @throws {CustomError} If database operation fails
 */
export const checkExamTypeExists = async (examTypeId: string): Promise<boolean> => {
  try {
    const examType = await findExamTypeById(examTypeId);
    return !!examType;
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError('Failed to check if exam type exists', 500, error);
  }
};

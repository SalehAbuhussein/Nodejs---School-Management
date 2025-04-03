import ExamType, { IExamType } from 'src/models/examType.model';

import { CustomError } from 'src/shared/utils/CustomError';

export class ExamTypeService {

  /**
   * Get all exam types
   * 
   * @returns {Promise<IExamType[]>} A promise that resolves to an array of exam types
   * @throws {CustomError} If database operation fails
   */
  static getAllExamTypes = async (): Promise<IExamType[]> => {
    try {
      return await ExamType.find();
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Failed to get exam types', 500);
    }
  };

  /**
   * Retrieve a specific exam type by ID
   * 
   * @param {string} examTypeId - The ID of the exam type to retrieve
   * @returns {Promise<IExamType|null>} A promise that resolves to the exam type or null if not found
   * @throws {Error} If database operation fails
   */
  static getExamType = async (examTypeId: string): Promise<IExamType | null> => {
    try {
      const examType = await ExamType.findById(examTypeId);

      if (!examType) {
        throw new CustomError('Exam type not found', 404);
      }

      return examType;
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
  static createExamType = async (name: string): Promise<IExamType> => {
    try {
      const existingExamType = await ExamType.findOne({ name });

      if (existingExamType) {
        throw new CustomError(`Exam type with name "${name}" already exists`, 400);
      }

      const examType = await ExamType.create({ name });
      return examType;
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
  static updateExamType = async (examTypeId: string, examTypeData: IExamType): Promise<IExamType | null> => {
    try {
      const examType = await ExamType.findById(examTypeId);
      
      if (!examType) {
        throw new CustomError('Exam type not found', 404);
      }

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
   * Delete an exam type
   * 
   * @param {string} examTypeId - The ID of the exam type to delete
   * @returns {Promise<boolean>} A promise that resolves to true if deletion was successful
   * @throws {CustomError} If exam type not found or database operation fails
   */
  static deleteExamType = async (examTypeId: string): Promise<boolean> => {
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
  static examTypeExists = async (examTypeId: string): Promise<boolean> => {
    try {
      const count = await ExamType.countDocuments({ _id: examTypeId });
      return count > 0;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Failed to check if exam type exists', 500, error);
    }
  };
};
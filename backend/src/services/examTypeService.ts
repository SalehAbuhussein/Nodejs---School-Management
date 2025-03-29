import ExamType, { IExamType } from 'src/models/examType.model';

import { CustomError } from 'src/shared/utils/CustomError';

export class ExamTypeService {

  /**
   * Get all exam types
   * @throws CustomError if database operation fails
   */
  static getAllExamTypes = async () => {
    try {
      return await ExamType.find();
    } catch (error) {
      throw new CustomError('Failed to retrieve exam types', 500, error);
    }
  };

  /**
   * Get exam type by ID
   * @param examTypeId - The ID of the exam type to retrieve
   * @throws CustomError if database operation fails
   */
  static getExamType = async (examTypeId: string) => {
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
   * @param name - The name of the exam type
   * @throws CustomError if validation fails or database operation fails
   */
  static createExamType = async (name: string) => {
    try {
      const existingExamType = await ExamType.findOne({ name });

      if (existingExamType) {
        throw new CustomError(`Exam type with name "${name}" already exists`, 400);
      }

      const examType = await ExamType.create({ name });
      return examType;
    } catch (error) {
      // If it's already a CustomError, rethrow it
      if (error instanceof CustomError) {
        throw error;
      }

      // Otherwise, wrap it in a CustomError
      throw new CustomError('Failed to create exam type', 500, error);
    }
  };

  /**
   * Update an existing exam type
   * @param examTypeId - The ID of the exam type to update
   * @param examTypeData - The data to update
   * @throws CustomError if exam type not found or database operation fails
   */
  static updateExamType = async (examTypeId: string, examTypeData: IExamType) => {
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

        return await examType.save();
      }
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      throw new CustomError('Failed to update exam type', 500, error);
    }
  };

  /**
   * Delete an exam type
   * @param examTypeId - The ID of the exam type to delete
   * @throws CustomError if exam type not found or database operation fails
   */
  static deleteExamType = async (examTypeId: string) => {
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
   * @param examTypeId - The ID of the exam type to check
   * @throws CustomError if database operation fails
   */
  static examTypeExists = async (examTypeId: string) => {
    try {
      const count = await ExamType.countDocuments({ _id: examTypeId });
      return count > 0;
    } catch (error) {
      throw new CustomError('Failed to check if exam type exists', 500, error);
    }
  };
};
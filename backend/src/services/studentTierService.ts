import StudentTier, { IStudentTier } from "src/models/studentTier.model";

import { CustomError } from "src/shared/utils/CustomError";

export class StudentTierService {
  /**
   * Retrieve all student tiers from the database
   * 
   * @returns {Promise<IStudentTier[]>} A promise that resolves to an array of student tiers
   * @throws {CustomError} If database operation fails
   */
  static getAllStudentTiers = async (): Promise<IStudentTier[]> => {
    try {
      return await StudentTier.find();
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Server Error', 500);
    }
  };

  /**
   * Retrieve a specific student tier by ID
   * 
   * @param {string} studentTierId - The ID of the student tier to retrieve
   * @returns {Promise<IStudentTier>} A promise that resolves to the student tier
   * @throws {CustomError} If student tier not found or database operation fails
   */  
  static getStudentTierById = async (studentTierId: string): Promise<IStudentTier> => {
    try {
      const studentTier = await StudentTier.findById(studentTierId);

      if (!studentTier) {
        throw new CustomError('Not Found', 404);
      }

      return studentTier
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Server Error', 500);
    }
  };

  /**
   * Create a new student tier
   * 
   * @param {IStudentTier} studentTier - The student tier data to create
   * @returns {Promise<IStudentTier>} A promise that resolves to the created student tier
   * @throws {CustomError} If validation fails or database operation fails
   */
  static createStudentTier = async (studentTier: IStudentTier): Promise<IStudentTier> => {
    try {
      const newStudentTier = await StudentTier.create(studentTier);

      return newStudentTier;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Server Error', 500);
    }
  };

  /**
   * Update an existing student tier
   * 
   * @param {string} studentTierId - The ID of the student tier to update
   * @param {IStudentTier} studentTierData - The updated student tier data
   * @returns {Promise<IStudentTier>} A promise that resolves to the updated student tier
   * @throws {CustomError} If student tier not found or database operation fails
   */
  static updateStudentTier = async (studentTierId: string, studentTierData: IStudentTier): Promise<IStudentTier> => {
    try {
      let studentTier = await StudentTier.findById(studentTierId);

      if (!studentTier) {
        throw new CustomError('Not Found', 404);
      }

      if (studentTierData.tierName !== studentTier.tierName) {
        studentTier.tierName = studentTierData.tierName;
      }

      if (studentTierData.monthlySubscriptionFees !== studentTier.monthlySubscriptionFees) {
        studentTier.monthlySubscriptionFees = studentTierData.monthlySubscriptionFees;
      }

      return await studentTier.save();
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Server Error', 500);
    }
  };

  /**
   * Delete a student tier
   * 
   * @param {string} studentTierId - The ID of the student tier to delete
   * @returns {Promise<boolean>} A promise that resolves to true if deletion was successful
   * @throws {CustomError} If student tier not found or database operation fails
   */
  static deleteStudentTier = async (studentTierId: string): Promise<boolean> => {
    try {
      const result = await StudentTier.deleteOne({ _id: studentTierId });

      if (result.deletedCount === 0) {
        throw new CustomError('Not Found', 404);
      }

      return result.deletedCount > 0; 
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Server Error', 500);
    }
  };

  /**
   * Check if a student tier exists
   * 
   * @param {string} studentTierId - The ID of the student tier to check
   * @returns {Promise<boolean>} A promise that resolves to true if student tier exists
   * @throws {CustomError} If database operation fails
   */
  static studentTierExist = async (studentTierId: string): Promise<boolean> => {
    try {
      const count = await StudentTier.countDocuments({ _id: studentTierId });
      return count > 0;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('Failed to check if permission exists', 500, error);
    }
  };
}
import TeacherExam, { ITeacherExam } from 'src/models/teacherExam.model'

import { CustomError } from "src/shared/utils/CustomError";

export class TeacherExamService {
  /**
   * Retrieve a specific teacher exam by ID
   * 
   * @param {string} teacherExamId - The ID of the teacher exam to retrieve
   * @returns {Promise<ITeacherExam>} A promise that resolves to the teacher exam
   * @throws {CustomError} If teacher exam not found or database operation fails
   */
  static getTeacherExamById = async (teacherExamId: string): Promise<ITeacherExam> => {
    try {
      const teacherExam = await TeacherExam.findById(teacherExamId);

      if (!teacherExam) {
        throw new CustomError('Not Found!', 404);
      }
    
      return teacherExam;
    } catch (error) {
      throw new CustomError('Server Error', 500, error);
    }
  };

  /**
   * Create a new teacher exam
   * 
   * @param {ITeacherExam} teacherExamData - The teacher exam data to create
   * @returns {Promise<ITeacherExam>} A promise that resolves to the created teacher exam
   * @throws {CustomError} If validation fails or database operation fails
   */
  static createTeacherExam = async (teacherExamData: Omit<ITeacherExam, 'createdBy'>): Promise<ITeacherExam> => {
    try {
      return await TeacherExam.create(teacherExamData);
    } catch (error) {
      throw new CustomError('Server Error', 500, error);
    }
  };

  /**
   * Update an existing teacher exam
   * 
   * @param {string} teacherExamId - The ID of the teacher exam to update
   * @param {ITeacherExam} teacherExamData - The updated teacher exam data
   * @returns {Promise<ITeacherExam>} A promise that resolves to the updated teacher exam
   * @throws {CustomError} If teacher exam not found or database operation fails
   */
  static updateTeacherExam = async (teacherExamId: string, teacherExamData: { title: string,fullExamGrade: number }): Promise<ITeacherExam> => {
    try {
      const teacherExam = await TeacherExam.findById(teacherExamId);

      if (!teacherExam) {
        throw new CustomError('Not Found!', 404);
      }

      if (teacherExam.title !== teacherExamData.title) {
        teacherExam.title = teacherExamData.title;
      }

      if (teacherExam.fullExamGrade !== teacherExamData.fullExamGrade) {
        teacherExam.fullExamGrade = teacherExamData.fullExamGrade;
      }

      return await teacherExam.save();
    } catch (error) {
      throw new CustomError('Server Error', 500, error);
    }
  };
};
import { Types } from "mongoose";

import StudentExam, { ICreateStudentExam, IStudentExam } from "src/models/studentExam.model";
import { CustomError } from "src/shared/utils/CustomError";

export class StudentExamService {
  /**
   * Get a single exam by ID
   * @param examId - The ID of the exam to retrieve
   * @returns Promise<IStudentExam | null>
   */
  static findExamById = async (id: string) => {
    return StudentExam.findById(id);
  }

  /**
   * Create a new student exam
   * @param examData - The data for the new exam
   * @returns Promise<IStudentExam>
   */
  static createExam = async (examData: ICreateStudentExam): Promise<IStudentExam> => {
    const newExam = new StudentExam({
      title: examData.title,
      studentGrade: examData.studentGrade,
      subjectId: new Types.ObjectId(examData.subjectId),
      studentId: new Types.ObjectId(examData.studentId),
      // Map other fields as needed
    });

    return await newExam.save();
  }

  /**
   * Update an existing student exam
   * @param examId - The ID of the exam to update
   * @param examData - The data to update
   * @returns Promise<IStudentExam | null>
   */
  static updateExam = async (examId: string, examData: Omit<ICreateStudentExam, 'studentId' | 'subjectId'>) => {
    const exam = await StudentExam.findById(examId);

    if (!exam) {
      return null;
    }

    if (examData.title !== undefined) {
      exam.title = examData.title;
    }

    if (examData.studentGrade !== undefined) {
      exam.studentGrade = examData.studentGrade;
    }

    return await exam.save();
  }

  /**
   * Delete a student exam
   * @param examId - The ID of the exam to delete
   * @returns Promise<boolean>
   */
  static deleteExam = async (examId: string): Promise<boolean> => {
    try {
      const result = await StudentExam.deleteOne({ _id: examId });

      if (result.deletedCount === 0) {
        throw new CustomError('Exam not found', 404);
      }

      return result.deletedCount > 0;
    } catch (error) {
      throw new CustomError('Error deleting exam', 500);
    }
  }

  /**
   * Check if a student exam exists
   * @param examId - The ID of the exam to check
   * @returns Promise<boolean>
   */
  static examExists = async (examId: string) => {
    const count = await StudentExam.countDocuments({ _id: examId });
    return count > 0;
  }

  /**
   * Take an exam logic
   * @param examId - The ID of the exam to take
   * @param userId - The user ID of the student taking the exam
   * @returns Promise<any>
   */
  static takeExam = async (examId: string, userId: string) => {
    const exam = await StudentExam.findById(examId);

    // if (exm)
  }
}
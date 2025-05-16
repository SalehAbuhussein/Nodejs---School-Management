import { NextFunction, Request, Response } from 'express';

import StudentExam from 'src/db/models/studentExam.model';

import * as StudentExamService from 'src/v1/services/studentExamService';

import { CreateStudentExamResponse, DeleteStudentExamParams, DeleteStudentExamResponse, GetStudentExamParams, GetStudentExamResponse, PostStudentExamBody, UpdateStudentExamBody, UpdateStudentExamParams, UpdateStudentExamResponse, TakeTeacherExamResponse, TakeTeacherExamBody, TakeTeacherExamParams } from 'src/v1/controllers/types/studentExamController.types';

/**
 * Get single exam
 *
 * @param { Request } req
 * @param { Response<GetStudentExamResponse> } res
 * @param { NextFunction } next
 */
export const getExam = async (req: Request, res: Response<GetStudentExamResponse>, next: NextFunction) => {
  try {
    const { examId }: GetStudentExamParams = req.params as GetStudentExamParams;
    const exam = await StudentExamService.findExamById(examId);
    if (!exam) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Not Found!',
      });
    }

    return res.json({
      status: 200,
      data: exam,
      message: 'Exam fetched successfully!',
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      data: null,
      message: 'Server Error',
      error: error,
    });
  }
};

/**
 * Create exam
 *
 * @param { Request } req
 * @param { Response<CreateStudentExamResponse> } res
 * @param { NextFunction } next
 */
export const createExam = async (req: Request, res: Response<CreateStudentExamResponse>, next: NextFunction) => {
  try {
    const { title, studentGrade, subjectId, studentId, semester = 'First', year = new Date().getFullYear() }: PostStudentExamBody = req.body;

    const exam = await StudentExamService.createExam({
      title,
      studentGrade,
      subjectId,
      studentId,
      semester,
      year,
    });

    return res.status(201).json({
      status: 201,
      data: exam,
      message: 'Exam created successfully!',
    });
  } catch (error: any) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
      data: null,
      error: error.originalError,
    });
  }
};

/**
 * Update exam
 *
 * @param { Request } req
 * @param { Response<UpdateStudentExamResponse> } res
 * @param { NextFunction } next
 */
export const updateExam = async (req: Request, res: Response<UpdateStudentExamResponse>, next: NextFunction) => {
  try {
    const { title, studentGrade }: UpdateStudentExamBody = req.body;
    const { examId }: UpdateStudentExamParams = req.params as UpdateStudentExamParams;
    const exam = await StudentExamService.updateExam(examId, { title, studentGrade });

    return res.json({
      status: 200,
      data: exam,
      message: 'Exam Updated Successfully!',
    });
  } catch (error: any) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
      data: null,
      error: error.originalError,
    });
  }
};

/**
 * Delete exam
 *
 * @param { Request } req
 * @param { Response<DeleteStudentExamResponse> } res
 * @param { NextFunction } next
 */
export const deleteExam = async (req: Request, res: Response<DeleteStudentExamResponse>, next: NextFunction) => {
  try {
    const { examId }: DeleteStudentExamParams = req.params as DeleteStudentExamParams;
    await StudentExamService.deleteExam(examId);

    return res.json({
      status: 200,
      message: 'Exam Deleted Successfully!',
    });
  } catch (error: any) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
      error: error.originalError,
    });
  }
};

/**
 * Take exam
 *
 * @param { Request } req
 * @param { Response<TakeTeacherExamResponse> } res
 * @param { NextFunction } next
 */
export const takeExam = async (req: Request, res: Response<TakeTeacherExamResponse>, next: NextFunction) => {
  try {
    const { teacherExamId } = req.params as TakeTeacherExamParams;
    const { studentId, grade, semester, year } = req.body as TakeTeacherExamBody;
    const newStudentExam = await StudentExamService.takeExam(teacherExamId, studentId, grade, semester, year);

    return res.json({
      status: 200,
      data: newStudentExam,
      message: 'Exam grade recorded successfully',
    });
  } catch (error: any) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message || 'Server Error',
      data: null,
      error: error.originalError || error,
    });
  }
};

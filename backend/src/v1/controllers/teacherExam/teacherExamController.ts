import { NextFunction, Request, Response } from 'express';

import * as TeacherExamService from 'src/v1/services/teacherExamService';

import { CreateTeacherExamResponse, GetTeacherExamParams, GetTeacherExamResponse, PostTeacherExamBody, UpdateTeacherExamBody, UpdateTeacherExamParams, UpdateTeacherExamResponse } from 'src/v1/controllers/types/teacherExamController.types';

/**
 * Get Single Teacher Exam
 *
 * @param { Request } req
 * @param { Response<GetTeacherExamResponse> } res
 * @param { NextFunction } next
 */
export const getTeacherExam = async (req: Request, res: Response<GetTeacherExamResponse>, next: NextFunction) => {
  try {
    const { teacherExamId } = req.params as GetTeacherExamParams;
    const teacherExam = await TeacherExamService.getTeacherExamById(teacherExamId);

    if (!teacherExam) {
      return res.status(404).json({
        status: 404,
        message: 'Teacher Exam not found!',
        data: null,
      });
    }

    return res.json({
      status: 200,
      data: teacherExam,
      message: 'Teacher Exam fetched successfully!',
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
 * Create Teacher Exam which is the parent of Exam model
 *
 * @param { Response<CreateTeacherExamResponse> } req
 * @param { Request } res
 * @param { NextFunction } next
 */
export const createTeacherExam = async (req: Request, res: Response<CreateTeacherExamResponse>, next: NextFunction) => {
  try {
    const { title, subjectId, examTypeId, fullExamGrade, examId }: PostTeacherExamBody = req.body;

    // Add Created by user ID
    const teacherExam = await TeacherExamService.createTeacherExam({
      examId,
      examTypeId,
      subjectId,
      title,
      fullExamGrade,
    });

    return res.status(201).json({
      status: 201,
      data: teacherExam,
      message: 'Teacher Exam created successfully!',
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
 * Update Teacher Exam
 *
 * @param { Response<UpdateTeacherExamResponse> } req
 * @param { Request } res
 * @param { NextFunction } next
 */
export const updateTeacherExam = async (req: Request, res: Response<UpdateTeacherExamResponse>, next: NextFunction) => {
  try {
    const { title, fullExamGrade } = req.body as UpdateTeacherExamBody;
    const { teacherExamId } = req.params as UpdateTeacherExamParams;

    const teacherExam = await TeacherExamService.updateTeacherExam(teacherExamId, { title, fullExamGrade });

    return res.json({
      status: 200,
      data: teacherExam,
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

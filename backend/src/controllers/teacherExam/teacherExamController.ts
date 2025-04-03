import { NextFunction, Request, Response } from "express";

import mongoose from "mongoose";

import { TeacherExamService } from "src/services/teacherExamService";

import { 
  CreateTeacherExamResponse, 
  GetTeacherExamParams, 
  GetTeacherExamResponse, 
  PostTeacherExamBody, 
  UpdateTeacherExamBody, 
  UpdateTeacherExamParams, 
  UpdateTeacherExamResponse
} from "src/shared/types/teacherExamController.types";

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
    const { title, subjectId, examTypeId, fullExamGrade }: PostTeacherExamBody = req.body;

    // Add Created by user ID
    const teacherExam = await TeacherExamService.createTeacherExam({
      examTypeId: new mongoose.Schema.Types.ObjectId(examTypeId),
      subjectId: new mongoose.Schema.Types.ObjectId(subjectId),
      title,
      fullExamGrade,
    });

    return res.status(201).json({
      status: 201,
      data: teacherExam,
      message: 'Teacher Exam created successfully!'
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
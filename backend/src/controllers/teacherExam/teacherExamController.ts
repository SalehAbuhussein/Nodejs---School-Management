import { NextFunction, Request, Response } from "express";

import TeacherExam from "src/models/teacherExam.model";

import { CreateTeacherExamResponse, GetTeacherExamParams, GetTeacherExamResponse, PostTeacherExamBody, UpdateTeacherExamBody, UpdateTeacherExamParams, UpdateTeacherExamResponse } from "src/shared/types/teacherExamController.types";

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
    
    const teacherExam = await TeacherExam.findById(teacherExamId);

    if (!teacherExam) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Not Found!',
      });
    }

    return res.json({
      status: 200,
      data: teacherExam,
      message: 'Teacher Exam fetched successfully!',
    });
  } catch (error) {
    return res.status(500).json({ 
      status: 200,
      data: null,
      message: 'Server Error',
      error: error, 
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
    const { title, examTypeId, fullExamGrade, examId }: PostTeacherExamBody = req.body;

    // Add Created by user ID
    const newTeacherExam = await new TeacherExam({
      examId,
      examTypeId,
      title,
      fullExamGrade,
    }).save();

    return res.status(201).json({
      status: 201,
      data: newTeacherExam,
      message: 'Teacher Exam created successfully!'
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      data: null,
      message: 'Server Error',
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

    let teacherExam = await TeacherExam.findById(teacherExamId);

    if (!teacherExam) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Not Found!',
      });
    }

    if (title) {
      teacherExam.title = title;
    }

    if (fullExamGrade) {
      teacherExam.fullExamGrade = fullExamGrade;
    }

    teacherExam = await teacherExam.save();

    return res.json({
      status: 200,
      data: teacherExam,
      message: 'Exam Updated Successfully!',
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      data: null,
      message: 'Server Error',
      error: error,
    });
  }
};
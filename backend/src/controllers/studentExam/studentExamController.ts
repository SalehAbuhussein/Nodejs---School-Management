import { NextFunction, Request, Response } from "express";

import StudentExam from "src/models/studentExam.model";

import { StudentExamService } from "src/services/studentExamService";

import { CreateStudentExamResponse, DeleteStudentExamParams, DeleteStudentExamResponse, GetStudentExamParams, GetStudentExamResponse, PostStudentExamBody, UpdateStudentExamBody, UpdateStudentExamParams, UpdateStudentExamResponse, TakeTeacherExamResponse, TakeTeacherExamParams } from "src/shared/types/studentExamController.types";

/**
 * Get single exam
 * 
 * @param { Request } req 
 * @param { Response<GetStudentExamResponse> } res
 * @param { NextFunction } next 
 */
export const getExam = async (req: Request, res: Response<GetStudentExamResponse>, next: NextFunction) => {
  const { examId }: GetStudentExamParams = req.params as GetStudentExamParams;

  try {
    const exam = await StudentExam.findById(examId);

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
    const { title, studentGrade, subjectId, studentId }: PostStudentExamBody = req.body;

    const exam = await StudentExamService.createExam({
      title,
      studentGrade,
      subjectId,
      studentId,
    });

    return res.status(201).json({
      status: 201,
      data: exam,
      message: 'Exam created successfully!'
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

export const takeExam = async (req: Request, res: Response<TakeTeacherExamResponse>, next: NextFunction) => {
  const { examId } = req.params as TakeTeacherExamParams;

  try {

    // 1- Check if Student is enrolled in the course.
    // 2- Check if Student is active.



  } catch (error: any) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
      error: error.originalError,
    });
  }
};
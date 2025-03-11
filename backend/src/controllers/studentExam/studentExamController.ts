import { NextFunction, Request, Response } from "express";

import { Types } from "mongoose";

import StudentExam from "src/models/studentExam.model";

import { CreateExamResponse, DeleteExamParams, DeleteExamResponse, GetExamParams, GetExamResponse, GetExamsResponse, PostExamBody, UpdateExamBody, UpdateExamParams, UpdateExamResponse } from "src/shared/types/examController.types";

/**
 * Get list of exams
 * 
 * @param { Request } req 
 * @param { Response<GetExamsResponse> } res
 * @param { NextFunction } next 
 */
export const getExams = async (req: Request, res: Response<GetExamsResponse>, next: NextFunction) => {
  try {
    const exams = await StudentExam.find();

    return res.json({
      status: 200,
      data: exams,
      message: 'Exams Fetched Successfully!',
    })
  } catch (error) {
    return res.status(500).json({
      status: 500,
      data: null,
      message: 'Server Error',
      error: error,
    });
  };
};

/**
 * Get single exam
 * 
 * @param { Request } req 
 * @param { Response<GetExamResponse> } res
 * @param { NextFunction } next 
 */
export const getExam = async (req: Request, res: Response<GetExamResponse>, next: NextFunction) => {
  const { examId }: GetExamParams = req.params as GetExamParams;

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
    })
  }
};

/**
 * Create exam
 * 
 * @param { Request } req 
 * @param { Response<CreateExamResponse> } res
 * @param { NextFunction } next 
 */
export const createExam = async (req: Request, res: Response<CreateExamResponse>, next: NextFunction) => {
  const { title, studentGrade, subjectId, studentId }: PostExamBody = req.body;

  const newExam = new StudentExam({
    title,
    studentGrade,
    subjectId,
    studentId,
  });

  try {
    const exam = await newExam.save();

    return res.status(201).json({
      status: 201,
      data: exam,
      message: 'Exam created successfully!'
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
 * Update exam
 * 
 * @param { Request } req 
 * @param { Response<UpdateExamResponse> } res
 * @param { NextFunction } next 
 */
export const updateExam = async (req: Request, res: Response<UpdateExamResponse>, next: NextFunction) => {
  const { title, studentGrade, subjectId }: UpdateExamBody = req.body;
  const { examId }: UpdateExamParams = req.params as UpdateExamParams;

  try {
    let exam = await StudentExam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Not Found!',
      });
    }

    if (exam.title && title) {
      exam.title = title;
    }

    if (exam.studentGrade && studentGrade) {
      exam.studentGrade = studentGrade;
    }

    if (subjectId) {
      exam.subjectId = { type: new Types.ObjectId(subjectId) };
    }

    exam = await exam.save();

    return res.json({
      status: 200,
      data: exam,
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

/**
 * Delete exam
 * 
 * @param { Request } req 
 * @param { Response<DeleteExamResponse> } res
 * @param { NextFunction } next 
 */
export const deleteExam = async (req: Request, res: Response<DeleteExamResponse>, next: NextFunction) => {
  const { examId }: DeleteExamParams = req.params as DeleteExamParams;

  try {
    const exam = await StudentExam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        status: 404,
        message: 'Exam not found!',
      });
    }

    await exam?.deleteOne();

    return res.json({ 
      status: 200, 
      message: 'Exam Deleted Successfully!',
     });
  } catch (error) {
    return res.status(500).json({ 
      status: 500, 
      message: 'Server Error', 
      error: error
     });
  }
};
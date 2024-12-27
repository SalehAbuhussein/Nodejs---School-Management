import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";

import Exam, { IExam } from "src/models/exam";

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
    const exams = await Exam.find();

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
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Exam not found!',
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
  const { title, studentGrade, fullExamGrade, courseId, examTypeId, studentId }: PostExamBody = req.body;

  const newExam = new Exam({
    title,
    studentGrade,
    fullExamGrade,
    courseId,
    examTypeId,
    studentId,
  });

  try {
    const exam = await newExam.save();

    return res.status(201).json({
      status: 201,
      data: exam,
      message: 'Exam created successfully!'
    })
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
  const { title, studentGrade, fullExamGrade, studentId, courseId, examTypeId }: UpdateExamBody = req.body;
  const { examId }: UpdateExamParams = req.params as UpdateExamParams;

  try {
    let exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Role not found!',
      })
    }

    if (exam.title && title) {
      exam.title = title;
    }

    if (exam.studentGrade && studentGrade) {
      exam.studentGrade = studentGrade;
    }

    if (exam.fullExamGrade && fullExamGrade) {
      exam.fullExamGrade = fullExamGrade;
    }

    if (studentId) {
      exam.studentId = { type: new Types.ObjectId(studentId) };
    }

    if (courseId) {
      exam.courseId = { type: new Types.ObjectId(courseId) };
    }

    if (examTypeId) {
      exam.examTypeId = { type: new Types.ObjectId(examTypeId) };
    }

    exam = await exam.save();

    return res.json({
      status: 200,
      data: exam,
      message: 'Exam Updated Successfully!',
    })
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
    const exam = await Exam.findById(examId);

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
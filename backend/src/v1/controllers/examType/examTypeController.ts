import { NextFunction, Request, Response } from 'express';

import ExamType from 'src/db/models/examType.model';

import * as ExamTypeService from 'src/v1/services/examTypeService';

import { DeleteExamTypeParams, GetExamTypeParams, PostExamTypeBody, UpdateExamTypeBody, UpdateExamTypeParams, UpdateExamTypeResponse, CreateExamTypeResponse, DeleteExamTypeResponse, GetExamTypeResponse, GetExamTypesResponse } from 'src/v1/controllers/types/examTypeController.types';

import { CustomError } from 'src/shared/utils/CustomError';

/**
 * Get single examType
 *
 * @param { Request } req
 * @param { Response<GetExamTypeResponse> } res
 * @param { NextFunction } next
 */
export const getExamType = async (req: Request, res: Response<GetExamTypeResponse>, next: NextFunction) => {
  try {
    const { examTypeId }: GetExamTypeParams = req.params as GetExamTypeParams;
    const examType = await ExamTypeService.getExamType(examTypeId);

    return res.json({
      status: 200,
      data: examType,
      message: 'Exam type fetched successfully!',
    });
  } catch (error: any) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        data: null,
        error: error.originalError,
      });
    }

    return res.status(error.statusCode).json({
      status: error.statusCode,
      data: null,
      message: error.message,
      error: error.originalError,
    });
  }
};

/**
 * Create examType
 *
 * @param { Request } req
 * @param { Response<CreateExamTypeResponse> } res
 * @param { NextFunction } next
 */
export const createExamType = async (req: Request, res: Response<CreateExamTypeResponse>, next: NextFunction) => {
  try {
    const { name }: PostExamTypeBody = req.body;

    const newExamType = await new ExamType({ name }).save();

    return res.status(201).json({
      status: 201,
      data: newExamType,
      message: 'Exam Type created successfully!',
    });
  } catch (error: any) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      data: null,
      message: error.message,
      error: error.originalError,
    });
  }
};

/**
 * Update examType
 *
 * @param { Request } req
 * @param { Response<UpdateExamTypeResponse> } res
 * @param { NextFunction } next
 */
export const updateExamType = async (req: Request, res: Response<UpdateExamTypeResponse>, next: NextFunction) => {
  try {
    const { name }: UpdateExamTypeBody = req.body;
    const { examTypeId }: UpdateExamTypeParams = req.params as UpdateExamTypeParams;

    const examType = await ExamTypeService.updateExamType(examTypeId, { name });

    return res.json({
      status: 200,
      data: examType ?? null,
      message: 'Exam type Updated Successfully!',
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
 * Update examType
 *
 * @param { Request } req
 * @param { Response<DeleteExamTypeResponse> } res
 * @param { NextFunction } next
 */
export const deleteExamType = async (req: Request, res: Response<DeleteExamTypeResponse>, next: NextFunction) => {
  try {
    const { examTypeId }: DeleteExamTypeParams = req.params as DeleteExamTypeParams;
    await ExamTypeService.deleteExamType(examTypeId);

    return res.json({
      status: 200,
      message: 'Exam type Deleted Successfully!',
      data: null,
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

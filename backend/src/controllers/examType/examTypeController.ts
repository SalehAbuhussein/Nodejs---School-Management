import { NextFunction, Request, Response } from "express";

import ExamType from "src/models/examTypes";

import { 
  DeleteExamTypeParams,
  GetExamTypeParams,
  PostExamTypeBody,
  UpdateExamTypeBody,
  UpdateExamTypeParams,
  UpdateExamTypeResponse,
  CreateExamTypeResponse,
  DeleteExamTypeResponse,
  GetExamTypeResponse,
  GetExamTypesResponse,
} from "src/shared/types/examTypeController.types";

/**
 * Get list of exam types
 * 
 * @param { Request } req 
 * @param { Response<GetExamTypesResponse> } res 
 * @param { NextFunction } next 
 */
export const getExamTypes = async (req: Request, res: Response<GetExamTypesResponse>, next: NextFunction) => {
  try {
    const examTypes = await ExamType.find();

    return res.json({
      status: 200,
      data: examTypes,
      message: 'Exam types Fetched Successfully!',
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
 * Get single examType
 * 
 * @param { Request } req 
 * @param { Response<GetExamTypeResponse> } res 
 * @param { NextFunction } next 
 */
export const getExamType = async (req: Request, res: Response<GetExamTypeResponse>, next: NextFunction) => {
  const { examTypeId }: GetExamTypeParams = req.params as GetExamTypeParams;

  try {
    const examType = await ExamType.findById(examTypeId);

    if (!examType) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Not Found!',
      });
    }

    return res.json({
      status: 200,
      data: examType,
      message: 'Exam type fetched successfully!',
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
 * Create examType
 * 
 * @param { Request } req 
 * @param { Response<CreateExamTypeResponse> } res 
 * @param { NextFunction } next 
 */
export const createExamType = async (req: Request, res: Response<CreateExamTypeResponse>, next: NextFunction) => {
  const { name }: PostExamTypeBody = req.body;

  const newExamType = new ExamType({ name });

  try {
    const examType = await newExamType.save();

    return res.status(201).json({
      status: 201,
      data: examType,
      message: 'Exam Type created successfully!'
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
 * Update examType
 * 
 * @param { Request } req 
 * @param { Response<UpdateExamTypeResponse> } res 
 * @param { NextFunction } next 
 */
export const updateExamType = async (req: Request, res: Response<UpdateExamTypeResponse>, next: NextFunction) => {
  const { name }: UpdateExamTypeBody = req.body;
  const { examTypeId }: UpdateExamTypeParams = req.params as UpdateExamTypeParams;

  try {
    let examType = await ExamType.findById(examTypeId);

    if (!examType) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Not Found!',
      })
    }

    if (examType.name && name) {
      examType.name = name;
    }

    examType = await examType.save();

    return res.json({
      status: 200,
      data: examType,
      message: 'Exam type Updated Successfully!',
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
 * Update examType
 * 
 * @param { Request } req 
 * @param { Response<DeleteExamTypeResponse> } res 
 * @param { NextFunction } next 
 */
export const deleteExamType = async (req: Request, res: Response<DeleteExamTypeResponse>, next: NextFunction) => {
  const { examTypeId }: DeleteExamTypeParams = req.params as DeleteExamTypeParams;

  try {
    const examType = ExamType.findById(examTypeId);

    if (!examType) {
      return res.status(404).json({
        status: 404,
        message: 'Exam type not found!',
      });
    }

    await examType.deleteOne();

    return res.json({
      status: 200,
      message: 'Exam type Deleted Successfully!',
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Server Error',
      error: error,
    });
  }
};
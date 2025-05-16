import { Request, Response, NextFunction } from 'express';

import * as StudentTierService from 'src/v1/services/studentTierService';

import { DeleteStudentTierParams, GetStudentTierParams, PostStudentTierBody, UpdateStudentTierBody, UpdateStudentTierParams, GetStudentTierResponse, UpdateStudentTierResponse, CreateStudentTierResponse, DeleteStudentTierResponse } from 'src/v1/controllers/types/studentTierController.types';

/**
 * Get a single Student-Tiers
 *
 * @param { Request } req
 * @param { Response<GetStudentTierResponse> } res
 * @param { NextFunction } next
 */
export const getStudentTier = async (req: Request, res: Response<GetStudentTierResponse>, next: NextFunction) => {
  try {
    const { studentTierId }: GetStudentTierParams = req.params as GetStudentTierParams;
    const studentTier = await StudentTierService.findStudentTierById(studentTierId);
    if (!studentTier) {
      return res.status(404).json({
        status: 404,
        message: 'Student Tier Not Found!',
        data: null,
      });
    }

    return res.json({
      status: 200,
      data: studentTier,
      message: 'Student Tier Fetched Successfully!',
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
 * Create Student-Tier
 *
 * @param { Request } req
 * @param { Response<CreateStudentTierResponse> } res
 * @param { NextFunction } next
 */
export const createStudentTier = async (req: Request, res: Response<CreateStudentTierResponse>, next: NextFunction) => {
  try {
    const { tierName, monthlySubscriptionFees }: PostStudentTierBody = req.body;
    const studentTier = await StudentTierService.createStudentTier({ tierName, monthlySubscriptionFees });

    return res.status(201).json({
      status: 201,
      data: studentTier,
      message: 'Student Tier Created Successfully',
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
 * Update Student-Tier
 *
 * @param { Request } req
 * @param { Response<UpdateStudentTierResponse> } res
 * @param { NextFunction } next
 */
export const updateStudentTier = async (req: Request, res: Response<UpdateStudentTierResponse>, next: NextFunction) => {
  try {
    const { tierName, monthlySubscriptionFees }: UpdateStudentTierBody = req.body;
    const { studentTierId }: UpdateStudentTierParams = req.params as UpdateStudentTierParams;

    const studentTier = await StudentTierService.updateStudentTier(studentTierId, { tierName, monthlySubscriptionFees });

    return res.json({
      status: 200,
      data: studentTier,
      message: 'Student tier Updated Successfully!',
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
 * Delete Student-Tier
 *
 * @param { Request } req
 * @param { Response<DeleteStudentTierResponse> } res
 * @param { NextFunction } next
 */
export const deleteStudentTier = async (req: Request, res: Response<DeleteStudentTierResponse>, next: NextFunction) => {
  try {
    const { studentTierId }: DeleteStudentTierParams = req.params as DeleteStudentTierParams;
    const isDeleted = await StudentTierService.deleteStudentTier(studentTierId);
    if (!isDeleted) {
      return res.status(404).json({
        status: 404,
        message: 'Student Tier Not Found!',
        data: null,
      });
    }

    return res.json({
      status: 200,
      message: 'Student Tier Deleted Successfully!',
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

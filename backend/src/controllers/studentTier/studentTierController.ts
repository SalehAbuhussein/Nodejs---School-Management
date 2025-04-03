import { Request, Response, NextFunction } from 'express';

import { StudentTierService } from 'src/services/studentTierService';

import {
  DeleteStudentTierParams,
  GetStudentTierParams,
  PostStudentTierBody,
  UpdateStudentTierBody,
  UpdateStudentTierParams,
  GetStudentTierResponse,
  GetStudentTiersResponse,
  UpdateStudentTierResponse,
  CreateStudentTierResponse,
  DeleteStudentTierResponse,
} from 'src/shared/types/studentTierController.types';

import { CustomError } from 'src/shared/utils/CustomError';

/**
 * Get All Student-Tiers
 * 
 * @param { Request } req 
 * @param { Response<GetStudentTiersResponse> } res 
 * @param { NextFunction } next
 */
export const getStudentTiers = async (req: Request, res: Response<GetStudentTiersResponse>, next: NextFunction) => {
  try {
    const studentTiers = await StudentTierService.getAllStudentTiers();

    return res.json({ 
      status: 200, 
      data: studentTiers,
      message: 'Student-tiers Fetched Successfully!', 
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
 * Get a single Student-Tiers
 * 
 * @param { Request } req 
 * @param { Response<GetStudentTierResponse> } res 
 * @param { NextFunction } next
 */
export const getStudentTier = async (req: Request, res: Response<GetStudentTierResponse>, next: NextFunction) => {
  try {
    const { studentTierId }: GetStudentTierParams = req.params as GetStudentTierParams;
    const studentTier = await StudentTierService.getStudentTierById(studentTierId);

    return res.json({ 
      status: 200, 
      data: studentTier, 
      message: 'Student Tier Fetched Successfully!',
    });
  } catch(error: any) {
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
      message: "Student Tier Created Successfully"
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

    await StudentTierService.deleteStudentTier(studentTierId);

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
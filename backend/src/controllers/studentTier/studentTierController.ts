import { Request, Response, NextFunction } from 'express';

import { HydratedDocument } from 'mongoose';

import StudentTier, { IStudentTier } from 'src/models/studentTier.model';

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

/**
 * Get All Student-Tiers
 * 
 * @param { Request } req 
 * @param { Response<GetStudentTiersResponse> } res 
 * @param { NextFunction } next
 */
export const getStudentTiers = async (req: Request, res: Response<GetStudentTiersResponse>, next: NextFunction) => {
  try {
    const studentTiers = await StudentTier.find();

    return res.json({ 
      status: 200, 
      data: studentTiers,
      message: 'Student-tiers Fetched Successfully!', 
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
 * Get a single Student-Tiers
 * 
 * @param { Request } req 
 * @param { Response<GetStudentTierResponse> } res 
 * @param { NextFunction } next
 */
export const getStudentTier = async (req: Request, res: Response<GetStudentTierResponse>, next: NextFunction) => {
  const { studentTierId }: GetStudentTierParams = req.params as GetStudentTierParams;

  try {
    const studentTier = await StudentTier.findById(studentTierId);

    if (!studentTier) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Not Found!',
      });
    }

    return res.json({ 
      status: 200, 
      data: studentTier, 
      message: 'Student Tier Fetched Successfully!',
    });
  } catch(error) {
    return res.status(500).json({ 
      status: 200,
      data: null,
      message: 'Server Error',
      error: error, 
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
  const { tierName, monthlySubscriptionFees }: PostStudentTierBody = req.body;
  
  const studentTier: HydratedDocument<IStudentTier> = new StudentTier({
    tierName,
    monthlySubscriptionFees
  });

  try {
    const newStudentTier = await studentTier.save();

    return res.status(201).json({ 
      status: 201,
      data: newStudentTier,
      message: "Student Tier Created Successfully"
    });
  } catch (error) {
    return res.status(500).json({ 
      status: 500, 
      data: null, 
      message: "Server error", 
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
  const { tierName, monthlySubscriptionFees }: UpdateStudentTierBody = req.body;
  const { studentTierId }: UpdateStudentTierParams = req.params as UpdateStudentTierParams;

  try {
    let studentTier = await StudentTier.findById(studentTierId);

    if (!studentTier) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Not Found!', 
      });
    }

    if (studentTier.tierName && tierName) {
      studentTier.tierName = tierName;
    }

    if (studentTier.monthlySubscriptionFees && monthlySubscriptionFees) {
      studentTier.monthlySubscriptionFees = monthlySubscriptionFees;
    }

    studentTier = await studentTier.save();

    res.json({
      status: 200,
      data: studentTier,
      message: 'Student tier Updated Successfully!',
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
 * Delete Student-Tier
 * 
 * @param { Request } req 
 * @param { Response<DeleteStudentTierResponse> } res 
 * @param { NextFunction } next
 */
export const deleteStudentTier = async (req: Request, res: Response<DeleteStudentTierResponse>, next: NextFunction) => {
  const { studentTierId }: DeleteStudentTierParams = req.params as DeleteStudentTierParams;

  try {
    const studentTier = await StudentTier.findById(studentTierId);

    await studentTier?.deleteOne();

    return res.json({ 
      status: 200, 
      message: 'Student Tier Deleted Successfully!',
     });
  } catch (error) {
    return res.status(500).json({ 
      status: 500, 
      message: 'Server Error', 
      error: error
     });
  }
};
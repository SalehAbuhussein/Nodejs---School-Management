import { NextFunction, Request, Response } from 'express';

import * as SubjectService from 'src/v1/services/subjectService';

import { CreateSubjectResponse, DeleteSubjectParams, DeleteSubjectResponse, GetSubjectParams, GetSubjectResponse, PostSubjectBody, UpdateSubjectBody, UpdateSubjectParams, UpdateSubjectResponse } from 'src/v1/controllers/types/subjectController.types';

/**
 * Get a single Subject
 *
 * @param { Request } req
 * @param { Response<GetSubjectResponse> } res
 * @param { NextFunction } next
 */
export const getSubject = async (req: Request, res: Response<GetSubjectResponse>, next: NextFunction) => {
  try {
    const { subjectId }: GetSubjectParams = req.params as GetSubjectParams;

    const subject = await SubjectService.getSubjectById(subjectId);

    return res.json({
      status: 200,
      data: subject,
      message: 'Subject fetched successfully!',
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
 * Create Subject and link it with Teacher
 *
 * @param { Request } req
 * @param { Response<CreateSubjectResponse> } res
 * @param { NextFunction } next
 */
export const createSubject = async (req: Request, res: Response<CreateSubjectResponse>, next: NextFunction) => {
  try {
    const { name, teacherId, totalSlots }: PostSubjectBody = req.body;
    const newSubject = await SubjectService.createSubject({ name, teacherId, totalSlots });

    return res.status(201).json({
      status: 201,
      data: newSubject,
      message: 'Subject created successfully!',
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
 * Update Subject
 *
 * @param { Request } req
 * @param { Response<UpdateSubjectResponse> } res
 * @param { NextFunction } next
 */
export const updateSubject = async (req: Request, res: Response<UpdateSubjectResponse>, next: NextFunction) => {
  try {
    const { name, isActive, teachersIds }: UpdateSubjectBody = req.body;
    const { subjectId }: UpdateSubjectParams = req.params as UpdateSubjectParams;

    const subject = await SubjectService.updateSubject(subjectId, { name, teachersIds, isActive });

    return res.json({
      status: 200,
      data: subject,
      message: 'Subject Updated Successfully!',
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
 * Delete Subject
 *
 * @param { Request } req
 * @param { Response<UpdateSubjectResponse> } res
 * @param { NextFunction } next
 */
export const deleteSubject = async (req: Request, res: Response<DeleteSubjectResponse>, next: NextFunction) => {
  try {
    const { subjectId }: DeleteSubjectParams = req.params as DeleteSubjectParams;

    await SubjectService.deleteSubject(subjectId);

    return res.json({
      status: 200,
      message: 'Subject Deleted Successfully!',
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

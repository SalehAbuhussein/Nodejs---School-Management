import { Request, Response, NextFunction } from 'express';

import * as EnrollmentService from 'src/v1/services/enrollmentService';

import { CreateEnrollmentResponse, DeleteIEnrollmentResponse, DeleteEnrollmentParams, PostEnrollmentBody } from 'src/v1/controllers/types/enrollmentController.types';

import { CustomError } from 'src/shared/utils/CustomError';

/**
 * Enroll Student in Subject
 *
 * @param { Request } req
 * @param { Response } res
 * @param { NextFunction } next
 */
export const enrollStudent = async (req: Request, res: Response<CreateEnrollmentResponse>, next: NextFunction) => {
  try {
    const { studentId, subjectId, enrollmentFees, enrollmentDate = new Date(), semester = 'First' }: PostEnrollmentBody = req.body;

    const enrollment = await EnrollmentService.enrollStudent({
      studentId,
      subjectId,
      enrollmentFees,
      enrollmentDate,
      semester,
    });

    return res.status(201).json({
      status: 201,
      data: enrollment,
      message: 'Enrollment Created Successfully',
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      data: null,
      error: error,
      message: 'Server error',
    });
  }
};

/**
 * Unenroll student from a Subject
 *
 * @param { Request } req
 * @param { Response<DeleteIEnrollmentResponse> } res
 * @param { NextFunction } next
 */
export const unenrollStudent = async (req: Request, res: Response<DeleteIEnrollmentResponse>, next: NextFunction) => {
  try {
    const { enrollmentId } = req.params as DeleteEnrollmentParams;

    const enrollment = await EnrollmentService.unenrollStudent(enrollmentId);

    if (!enrollment?.success) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Enrollment not found',
      });
    }

    return res.json({
      status: 200,
      data: null,
      message: 'You have unenrolled successfully',
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        data: null,
        error: error.originalError,
      });
    }

    return res.status(500).json({
      status: 500,
      message: 'Server Error',
      data: null,
      error: error,
    });
  }
};
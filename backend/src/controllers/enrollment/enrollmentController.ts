import { Request, Response, NextFunction } from 'express';

import mongoose from 'mongoose';

import Subject from 'src/models/subject.model';
import Enrollment from 'src/models/enrollment.model';

import { 
  CreateEnrollmentResponse,
  DeleteIEnrollmentResponse,
  DeleteEnrollmentParams,
  PostEnrollmentBody
} from 'src/shared/types/enrollmentController.types';

/**
 * Enroll Student in Subject
 * 
 * @param { Request } req 
 * @param { Response } res 
 * @param { NextFunction } next 
 */
export const enrollStudent = async (req: Request, res: Response<CreateEnrollmentResponse>, next: NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { studentId, subjectId, enrollmentFees, enrollmentDate = new Date(), semester = 'First' }: PostEnrollmentBody = req.body;

    const enrollment = await Enrollment.create([{
      studentId,
      subjectId,
      enrollmentFees,
      enrollmentDate,
      semester,
      year: enrollmentDate.getFullYear(),
    }], { session });

    await Subject.findByIdAndUpdate(
      subjectId, 
      { 
        $inc: { currentSlots: 1 },
        $push: { enrollments: enrollment }
      },
      { new: true, runValidators: true, session },
    );

    await session.commitTransaction();

    return res.status(201).json({
      status: 201,
      data: enrollment[0],
      message: 'Enrollment Created Successfully',
    });
  } catch (error) {
    session.abortTransaction();

    return res.status(500).json({
      status: 500,
      data: null,
      error: error,
      message: "Server error"
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
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { enrollmentId } = req.params as DeleteEnrollmentParams;

    const enrollment = await Enrollment
      .where('isDeleted')
      .equals(false)
      .findOne({ _id: enrollmentId })
      .session(session);
    const subject = await Subject
      .where('isActive')
      .equals(true)
      .findOne({ _id: enrollment?.subjectId })
      .session(session);

    if (enrollment) {
      await Enrollment.softDelete({ _id: enrollmentId }, { session });
    }

    await enrollment?.save({ session });

    if (subject && subject.isLocked) {
      await session.abortTransaction();

      return res.status(403).json({
        status: 403,
        message: 'Subject is not available for enrollment',
      });
    }

    if (subject && subject.currentSlots > 0) {
      subject.enrollments = subject.enrollments.filter(id => !id.equals(enrollment?.id));
      subject.currentSlots -= 1;
      subject.isLocked = false;

      await subject.save({ session });
    }

    await session.commitTransaction();

    return res.json({
      status: 200,
      message: 'You have unenrolled successfully',
    });
  } catch (error) {
    await session.abortTransaction();

    return res.status(500).json({
      status: 500,
      message: 'Server Error',
      error: error,
    });
  }
};
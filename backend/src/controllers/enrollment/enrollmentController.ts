import { Request, Response, NextFunction } from 'express';

import mongoose from 'mongoose';

import Course from 'src/models/course.model';
import Enrollment from 'src/models/enrollment.model';

import { 
  CreateEnrollmentResponse,
  DeleteIEnrollmentResponse,
  DeleteEnrollmentParams,
  PostEnrollmentBody
} from 'src/shared/types/enrollmentController.types';

/**
 * Enroll Student in Course
 * 
 * @param { Request } req 
 * @param { Response } res 
 * @param { NextFunction } next 
 */
export const enrollStudent = async (req: Request, res: Response<CreateEnrollmentResponse>, next: NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { studentId, courseId, enrollmentFees, enrollmentDate = new Date(), semester = 'First' }: PostEnrollmentBody = req.body;

    const enrollment = await Enrollment.create([{
      studentId,
      courseId,
      enrollmentFees,
      enrollmentDate,
      semester,
      year: enrollmentDate.getFullYear(),
    }], { session });

    await Course.findByIdAndUpdate(
      courseId, 
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
 * Unenroll student from a course
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
    const course = await Course
      .where('isActive')
      .equals(true)
      .findOne({ _id: enrollment?.courseId })
      .session(session);

    if (enrollment) {
      await Enrollment.softDelete({ _id: enrollmentId }, { session });
    }

    await enrollment?.save({ session });

    if (course && course.isLocked) {
      await session.abortTransaction();

      return res.status(403).json({
        status: 403,
        message: 'Course is not available for enrollment',
      });
    }

    if (course && course.currentSlots > 0) {
      course.enrollments = course.enrollments.filter(id => !id.equals(enrollment?.id));
      course.currentSlots -= 1;
      course.isLocked = false;

      await course.save({ session });
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
import { NextFunction, Request, Response } from "express";

import mongoose from "mongoose";

import Subject from "src/models/subject.model";
import Teacher from "src/models/teacher.model";

import { CreateSubjectResponse, DeleteSubjectParams, DeleteSubjectResponse, GetSubjectParams, GetSubjectResponse, GetSubjectsResponse, PostSubjectBody, UpdateSubjectBody, UpdateSubjectParams, UpdateSubjectResponse } from "src/shared/types/subjectController.types";

/**
 * Get list of Subjects
 * 
 * @param { Request } req 
 * @param { Response<GetSubjectsResponse> } res 
 * @param { NextFunction } next 
 */
export const getSubjects = async (req: Request, res: Response<GetSubjectsResponse>, next: NextFunction) => {
  try {
    const subjects = await Subject.find();

    return res.json({
      status: 200,
      data: subjects,
      message: 'Subjects Fetched Successfully!',
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
 * Get a single Subject
 * 
 * @param { Request } req 
 * @param { Response<GetSubjectResponse> } res 
 * @param { NextFunction } next 
 */
export const getSubject = async (req: Request, res: Response<GetSubjectResponse>, next: NextFunction) => {
  const { subjectId }: GetSubjectParams = req.params as GetSubjectParams;

  try {
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Subject not found!',
      });
    }

    return res.json({
      status: 200,
      data: subject,
      message: 'Subject fetched successfully!',
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
 * Create Subject and link it with Teacher
 * 
 * @param { Request } req 
 * @param { Response<CreateSubjectResponse> } res 
 * @param { NextFunction } next 
 */
export const createSubject = async (req: Request, res: Response<CreateSubjectResponse>, next: NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, teacherId, totalSlots }: PostSubjectBody = req.body;
    const totalSlotsNumber = parseInt(totalSlots);

    const newSubject = await new Subject({
      name,
      teachers: [teacherId],
      totalSlots: totalSlotsNumber,
    }, null, { session }).save({ session });

    const teacher = await Teacher.findById(teacherId).session(session);
    if (!teacher) {
      await session.abortTransaction();

      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Teacher Not Found',
      });
    }

    if (!teacher.subjects.includes(newSubject._id)) {
      teacher.subjects.push(newSubject._id);
      await teacher.save({ session });
    }

    await session.commitTransaction();

    return res.status(201).json({
      status: 201,
      data: newSubject,
      message: 'Subject created successfully!'
    });
  } catch (error) {
    await session.abortTransaction();

    return res.status(500).json({
      status: 500,
      data: null,
      message: 'Server Error',
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
  const { name, isActive, teachersIds }: UpdateSubjectBody = req.body;
  const { subjectId }: UpdateSubjectParams = req.params as UpdateSubjectParams;

  try {
    let subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Not Found!',
      });
    }

    if (name) {
      subject.name = name;
    }

    subject.isActive = !!isActive;

    // Add new teachers to the subject (ensure no duplicates)
    if (teachersIds && teachersIds.length > 0) {
      // Use Mongoose's $addToSet to add teachers, ensuring no duplicates
      subject = await Subject.findByIdAndUpdate(
        subjectId,
        { $addToSet: { teachers: { $each: teachersIds } } }, // $each allows adding multiple teachers at once
        { new: true } // Return the updated subject document
      );  
    }

    if (subject) {
      subject = await subject.save();
    }

    return res.json({
      status: 200,
      data: subject,
      message: 'Subject Updated Successfully!',
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
 * Delete Subject
 * 
 * @param { Request } req 
 * @param { Response<UpdateSubjectResponse> } res 
 * @param { NextFunction } next 
 */
export const deleteSubject = async (req: Request, res: Response<DeleteSubjectResponse>, next: NextFunction) => {
  const { subjectId }: DeleteSubjectParams = req.params as DeleteSubjectParams;

  try {
    const subject = Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({
        status: 404,
        message: 'Subject not found!',
      });
    }

    await subject.deleteOne();

    return res.json({
      status: 200,
      message: 'Subject Deleted Successfully!',
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Server Error',
      error: error,
    });
  }
};
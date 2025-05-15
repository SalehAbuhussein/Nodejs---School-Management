import { NextFunction, Request, Response } from 'express';

import * as StudentService from 'src/v1/services/studentService';

import { DeleteStudentParams, GetStudentParams, PostStudentBody, UpdateStudentBody, UpdateStudentParams, CreateStudentResponse, DeleteStudentResponse, UpdateStudentResponse, GetStudentResponse } from 'src/v1/controllers/types/studentController.types';

/**
 * Get Single Student
 *
 * @param { Request } req
 * @param { Response<GetStudentResponse> } res
 * @param { NextFunction } next
 */
export const getStudent = async (req: Request, res: Response<GetStudentResponse>, next: NextFunction) => {
  try {
    const { studentId }: GetStudentParams = req.params as GetStudentParams;
    const student = await StudentService.findStudentById(studentId);
    if (!student) {
      return res.status(404).json({
        status: 404,
        message: 'Student Not Found!',
        data: null,
      });
    }

    return res.json({ status: 200, data: student, message: 'Student Fetched Successfully!' });
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
 * Create Student
 *
 * @param { Request } req
 * @param { Response<CreateStudentResponse> } res
 * @param { NextFunction } next
 */
export const createStudent = async (req: Request, res: Response<CreateStudentResponse>, next: NextFunction) => {
  try {
    const { firstName, secondName, thirdName, lastName, userId }: PostStudentBody = req.body;
    const student = await StudentService.createStudent({ firstName, secondName, thirdName, lastName, userId });

    return res.status(201).json({
      status: 201,
      data: student,
      message: 'Student Created Successfully',
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
 * Update Student
 *
 * @param { Request } req
 * @param { Response<UpdateStudentResponse> } res
 * @param { NextFunction } next
 */
export const updateStudent = async (req: Request, res: Response<UpdateStudentResponse>, next: NextFunction) => {
  try {
    const { firstName, lastName, secondName, thirdName, studentTierId }: UpdateStudentBody = req.body;
    const { studentId }: UpdateStudentParams = req.params as UpdateStudentParams;
    const student = await StudentService.updateStudent(studentId, { firstName, lastName, secondName, thirdName, studentTierId });

    return res.json({
      status: 200,
      data: student,
      message: 'Student Updated Successfully!',
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
 * Delete Student
 *
 * @param { Request } req
 * @param { Response<DeleteStudentResponse> } res
 * @param { NextFunction } next
 */
export const deleteStudent = async (req: Request, res: Response<DeleteStudentResponse>, next: NextFunction) => {
  try {
    const { studentId }: DeleteStudentParams = req.params as DeleteStudentParams;
    await StudentService.deleteStudent(studentId);

    return res.json({
      status: 200,
      message: 'Student Deleted Successfully!',
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

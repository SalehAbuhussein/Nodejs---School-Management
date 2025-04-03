import { Request, Response, NextFunction } from 'express';

import { HydratedDocument } from 'mongoose';

import Teacher, { ITeacher } from 'src/models/teacher.model';
import { TeacherService } from 'src/services/teacherService';

import { 
  CreateTeacherResponse,
  DeleteTeacherParams,
  DeleteTeacherResponse,
  GetTeacherParams,
  GetTeacherResponse,
  GetTeachersResponse,
  PostTeacherBody,
  UpdateTeacherBody,
  UpdateTeacherParams,
  UpdateTeacherResponse,

} from 'src/shared/types/teacherController.types';
import { CustomError } from 'src/shared/utils/CustomError';

/**
 * Get All Teachers
 * 
 * @param { Request } req 
 * @param { Response<GetTeachersResponse> } res 
 * @param { NextFunction } next
 */
export const getTeachers = async (req: Request, res: Response<GetTeachersResponse>, next: NextFunction) => {
  try {
    const teachers = await TeacherService.getAllTeachers();

    return res.json({ 
      status: 200, 
      data: teachers,
      message: 'Teachers Fetched Successfully!', 
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
 * Get Single Teacher
 * 
 * @param { Request } req 
 * @param { Response<GetTeacherResponse> } res 
 * @param { NextFunction } next
 */
export const getTeacher = async (req: Request, res: Response<GetTeacherResponse>, next: NextFunction) => {  
  try {
    const params: GetTeacherParams = req.params as GetTeacherParams;

    const teacher = await TeacherService.getTeacherById(params.teacherId);

    return res.json({ 
      status: 200, 
      data: teacher, 
      message: 'Teacher Fetched Successfully!',
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
 * Create Teacher
 * 
 * @param { Request } req 
 * @param { Response<CreateTeacherResponse> } res 
 * @param { NextFunction } next 
 */
export const createTeacher = async (req: Request, res: Response<CreateTeacherResponse>, next: NextFunction) => {
  try {
    const { firstName, secondName, lastName, thirdName, userId }: PostTeacherBody = req.body;
    
    const newTeacher = await TeacherService.createTeacher({ firstName, secondName, lastName, thirdName, userId });

    return res.status(201).json({
      status: 201,
      data: newTeacher,
      message: "Teacher Created Successfully"
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
 * Update Teacher
 * 
 * @param { Request } req 
 * @param { Response<UpdateTeacherResponse> } res 
 * @param { NextFunction } next 
 */
export const updateTeacher = async (req: Request, res: Response<UpdateTeacherResponse>, next: NextFunction) => {
  try {
    const { firstName, lastName, secondName, thirdName, isActive, subjects }: UpdateTeacherBody = req.body;
    const { teacherId }: UpdateTeacherParams = req.params as UpdateTeacherParams;

    const teacher = await TeacherService.updateTeacher(teacherId, { firstName, lastName, secondName, thirdName, isActive, subjects });

    return res.json({
      status: 200,
      data: teacher,
      message: 'Teacher Updated Successfully!',
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
 * Update Teacher
 * 
 * @param { Request } req 
 * @param { Response<UpdateTeacherResponse> } res 
 * @param { NextFunction } next 
 */
export const deleteTeacher = async (req: Request, res: Response<DeleteTeacherResponse>, next: NextFunction) => {
  try {
    const { teacherId }: DeleteTeacherParams = req.params as DeleteTeacherParams;
    await TeacherService.deleteTeacher(teacherId);

    return res.json({ 
      status: 200, 
      message: 'Teacher Deleted Successfully!',
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
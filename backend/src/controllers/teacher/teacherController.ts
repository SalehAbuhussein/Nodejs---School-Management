import { Request, Response, NextFunction } from 'express';

import { HydratedDocument } from 'mongoose';

import Teacher, { ITeacher } from 'src/models/teacher';

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

/**
 * Get All Teachers
 * 
 * @param { Request } req 
 * @param { Response<GetTeachersResponse> } res 
 * @param { NextFunction } next
 */
export const getTeachers = async (req: Request, res: Response<GetTeachersResponse>, next: NextFunction) => {
  try {
    const teachers = await Teacher.find();

    return res.json({ 
      status: 200, 
      data: teachers,
      message: 'Teachers Fetched Successfully!', 
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
 * Get Single Teacher
 * 
 * @param { Request } req 
 * @param { Response<GetTeacherResponse> } res 
 * @param { NextFunction } next
 */
export const getTeacher = async (req: Request, res: Response<GetTeacherResponse>, next: NextFunction) => {
  const params: GetTeacherParams = req.params as GetTeacherParams;

  try {
    const teacher = await Teacher.findById(params.teacherId);

    if (!teacher) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Not Found!',
      });
    }

    return res.json({ 
      status: 200, 
      data: teacher, 
      message: 'Teacher Fetched Successfully!',
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
 * Create Teacher
 * 
 * @param { Request } req 
 * @param { Response<CreateTeacherResponse> } res 
 * @param { NextFunction } next 
 */
export const createTeacher = async (req: Request, res: Response<CreateTeacherResponse>, next: NextFunction) => {
  const { firstName, secondName, lastName, thirdName, userId }: PostTeacherBody = req.body;
  
  const teacher: HydratedDocument<ITeacher> = new Teacher({
    firstName,
    secondName,
    thirdName,
    lastName,
    userId
  });

  try {
    const newTeacher = await teacher.save();

    return res.status(201).json({ 
      status: 201,
      data: newTeacher,
      message: "Teacher Created Successfully"
    });
  } catch (error) {
    return res.status(500).json({ 
      status: 500, 
      data: null, 
      message: "Server error" 
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
  const { firstName, lastName, secondName, thirdName, isActive }: UpdateTeacherBody = req.body;
  const { teacherId }: UpdateTeacherParams = req.params as UpdateTeacherParams;

  try {
    let teacher = await Teacher.findById({ _id: teacherId });

    if (!teacher) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Not Found!', 
      });
    }

    teacher.isActive = !!isActive;

    if (teacher.firstName && firstName) {
      teacher.firstName = firstName;
    }

    if (teacher.secondName && secondName) {
      teacher.secondName = secondName;
    }

    if (teacher.thirdName && thirdName) {
      teacher.thirdName = thirdName;
    }

    if (teacher.lastName && lastName) {
      teacher.lastName = lastName;
    }

    teacher = await teacher.save();

    res.json({
      status: 200,
      data: teacher,
      message: 'Teacher Updated Successfully!',
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
 * Update Teacher
 * 
 * @param { Request } req 
 * @param { Response<UpdateTeacherResponse> } res 
 * @param { NextFunction } next 
 */
export const deleteTeacher = async (req: Request, res: Response<DeleteTeacherResponse>, next: NextFunction) => {
  const { teacherId }: DeleteTeacherParams = req.params as DeleteTeacherParams;

  try {
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.json({
        status: 404,
        message: 'Not Found!',
      });
    }

    await teacher?.deleteOne();

    return res.json({ 
      status: 200, 
      message: 'Teacher Deleted Successfully!',
     });
  } catch (error) {
    return res.status(500).json({ 
      status: 500, 
      message: 'Server Error', 
      error: error
     });
  }
};
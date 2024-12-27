import { NextFunction, Request, Response } from "express";

import { HydratedDocument, Types } from "mongoose";

import Student, { IStudent } from "src/models/student";

import {
  DeleteStudentParams,
  GetStudentParams,
  PostStudentBody,
  UpdateStudentBody,
  UpdateStudentParams,
  CreateStudentResponse,
  DeleteStudentResponse,
  UpdateStudentResponse,
  GetStudentResponse, 
  GetStudentsResponse,
} from "src/shared/types/studentController.types";

/**
 * Get All Teachers
 * 
 * @param { Request } req 
 * @param { Response<GetStudentsResponse> } res 
 * @param { NextFunction } next
 */
export const getStudents = async (req: Request, res: Response<GetStudentsResponse>, next: NextFunction) => {
  try {
    const students = await Student.find();

    return res.json({ 
      status: 200, 
      data: students,
      message: 'Students Fetched Successfully!', 
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
 * Get Single Student
 * 
 * @param { Request } req 
 * @param { Response<GetStudentResponse> } res 
 * @param { NextFunction } next
 */
export const getStudent = async (req: Request, res: Response<GetStudentResponse>, next: NextFunction) => {
  const { studentId }: GetStudentParams = req.params as GetStudentParams;

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Student not found!',
      });
    }

    return res.json({ status: 200, data: student, message: 'Student Fetched Successfully!' });
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
 * Create Student
 * 
 * @param { Request } req 
 * @param { Response<CreateStudentResponse> } res 
 * @param { NextFunction } next 
 */
export const createStudent = async (req: Request, res: Response<CreateStudentResponse>, next: NextFunction) => {
  const { firstName, secondName, thirdName, lastName, userId }: PostStudentBody = req.body;
  
  const student: HydratedDocument<IStudent> = new Student({
    firstName,
    secondName,
    thirdName,
    lastName,
    userId,
  });

  try {
    const newStudent = await student.save();

    return res.status(201).json({ 
      status: 201,
      data: newStudent,
      message: "Student Created Successfully"
    });
  } catch (error) {
    return res.status(500).json({ status: 500, data: null, message: "" })
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
  const { firstName, lastName, secondName, thirdName, isActive, studentTierId }: UpdateStudentBody = req.body;
  const { studentId }: UpdateStudentParams = req.params as UpdateStudentParams;

  try {
    let student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Teacher Not Found!', 
      });
    }

    student.isActive = !!isActive;

    if (student.firstName && firstName) {
      student.firstName = firstName;
    }

    if (student.secondName && secondName) {
      student.secondName = secondName;
    }

    if (student.thirdName && thirdName) {
      student.thirdName = thirdName;
    }

    if (student.lastName && lastName) {
      student.lastName = lastName;
    }

    if (studentTierId) {
      student.studentTierId = { type: new Types.ObjectId(studentTierId) };
    }

    student = await student.save();

    return res.json({
      status: 200,
      data: student,
      message: 'Student Updated Successfully!',
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
 * Delete Student
 * 
 * @param { Request } req 
 * @param { Response<DeleteStudentResponse> } res 
 * @param { NextFunction } next 
 */
export const deleteStudent = async (req: Request, res: Response<DeleteStudentResponse>, next: NextFunction) => {
  const { studentId }: DeleteStudentParams = req.params as DeleteStudentParams;

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        status: 404,
        message: 'Student not found!',
      });
    }

    await student?.deleteOne();

    return res.json({ 
      status: 200, 
      message: 'Student Deleted Successfully!',
     });
  } catch (error) {
    return res.status(500).json({ 
      status: 500, 
      message: 'Server Error', 
      error: error
     });
  }
};
import { NextFunction, Request, Response } from "express";

import Course from "src/models/course";

import { CreateCourseResponse, DeleteCourseParams, DeleteCourseResponse, GetCourseParams, GetCourseResponse, GetCoursesResponse, PostCourseBody, UpdateCourseBody, UpdateCourseParams, UpdateCourseResponse } from "src/shared/types/courseController.types";

/**
 * Get list of Courses
 * 
 * @param { Request } req 
 * @param { Response<GetCoursesResponse> } res 
 * @param { NextFunction } next 
 */
export const getCourses = async (req: Request, res: Response<GetCoursesResponse>, next: NextFunction) => {
  try {
    const courses = await Course.find();

    return res.json({
      status: 200,
      data: courses,
      message: 'Courses Fetched Successfully!',
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
 * Get a single Course
 * 
 * @param { Request } req 
 * @param { Response<GetCourseResponse> } res 
 * @param { NextFunction } next 
 */
export const getCourse = async (req: Request, res: Response<GetCourseResponse>, next: NextFunction) => {
  const { courseId }: GetCourseParams = req.params as GetCourseParams;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Course not found!',
      });
    }

    return res.json({
      status: 200,
      data: course,
      message: 'Course fetched successfully!',
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
 * Create Course and link it with Teacher using junction table (TeacherCourse)
 * 
 * @param { Request } req 
 * @param { Response<CreateCourseResponse> } res 
 * @param { NextFunction } next 
 */
export const createCourse = async (req: Request, res: Response<CreateCourseResponse>, next: NextFunction) => {
  const { courseName, courseFees, teacherId }: PostCourseBody = req.body;

  const newCourse = new Course({
    courseName,
    courseFees,
    teachers: [teacherId],
  });

  try {
    const course = await newCourse.save();

    return res.status(201).json({
      status: 201,
      data: course,
      message: 'Course created successfully!'
    })
  } catch (error) {
    return res.status(500).json({
      status: 500,
      data: null,
      message: 'Server Error',
    });
  }
};

/**
 * Update Course
 * 
 * @param { Request } req 
 * @param { Response<UpdateCourseResponse> } res 
 * @param { NextFunction } next 
 */
export const updateCourse = async (req: Request, res: Response<UpdateCourseResponse>, next: NextFunction) => {
  const { courseName, courseFees, isActive, teachersIds }: UpdateCourseBody = req.body;
  const { courseId }: UpdateCourseParams = req.params as UpdateCourseParams;

  try {
    let course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: 'Course not found!',
      })
    }

    if (course.courseName && courseName) {
      course.courseName = courseName;
    }

    if (course.courseFees && courseFees) {
      course.courseFees = courseFees;
    }

    course.isActive = !!isActive;

    // Add new teachers to the course (ensure no duplicates)
    if (teachersIds && teachersIds.length > 0) {
      // Use Mongoose's $addToSet to add teachers, ensuring no duplicates
      course = await Course.findByIdAndUpdate(
        courseId,
        { $addToSet: { teachers: { $each: teachersIds } } }, // $each allows adding multiple teachers at once
        { new: true } // Return the updated course document
      );
    }

    if (course) {
      course = await course.save();
    }


    return res.json({
      status: 200,
      data: course,
      message: 'Course Updated Successfully!',
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
 * Delete Course
 * 
 * @param { Request } req 
 * @param { Response<UpdateCourseResponse> } res 
 * @param { NextFunction } next 
 */
export const deleteCourse = async (req: Request, res: Response<DeleteCourseResponse>, next: NextFunction) => {
  const { courseId }: DeleteCourseParams = req.params as DeleteCourseParams;

  try {
    const course = Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        status: 404,
        message: 'Course not found!',
      });
    }

    await course.deleteOne();

    return res.json({
      status: 200,
      message: 'Course Deleted Successfully!',
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Server Error',
      error: error,
    });
  }
};
import { ICourse } from "src/models/course.model";

export type GetCourseParams = { courseId: string };

export type PostCourseBody = { 
  courseName: string, 
  courseFees: number, 
  teacherId: string,
  totalSlots: string,
};

export type UpdateCourseBody = Omit<PostCourseBody, 'teacherId'> & { isActive: boolean, teachersIds: string[] };

export type UpdateCourseParams = { courseId: string };

export type DeleteCourseParams = { courseId: string };

export type GetCoursesResponse = {
  status: number,
  data: ICourse[] | null,
  message: string,
  error?: any,
};

export type GetCourseResponse = {
  status: number,
  data: ICourse | null,
  message: string,
  error?: any,
};

export type CreateCourseResponse = {
  status: number,
  data: ICourse | null,
  message: string,
  error?: any,
};

export type UpdateCourseResponse = {
  status: number,
  data: ICourse | null,
  message: string,
  error?: any,
};

export type DeleteCourseResponse = {
  status: number,
  message: string,
  error?: any,
};
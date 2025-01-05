import { Application, Router } from 'express';

import { body } from 'express-validator';

import * as courseController from 'src/controllers/course/courseController';

const router = Router();

/**
 * Get a list of courses
 * 
 * @route GET /courseRoutes
 */
router.get('', courseController.getCourses as Application);

/**
 * Get a single course
 * 
 * @route GET /courseRoutes/:courseId
 */
router.get('/:courseId', courseController.getCourse as Application);

/**
 * Create a course
 * 
 * @route POST /courseRoutes/create
 */
router.post('/create',
  body('courseName')
    .notEmpty()
    .withMessage('Course name can not be empty!')
    .escape(),
  body('courseFees')
    .notEmpty()
    .withMessage('Course fees can not be empty!')
    .escape(),
  body('teacherId')
    .notEmpty()
    .withMessage('Course can not be created without teacher!')
    .escape(),
  courseController.createCourse as Application
);

/**
 * Update course
 * 
 * @route PATCH /courseRoutes/:courseId
 */
router.patch('/:courseId',
  body('courseName')
  .notEmpty()
  .withMessage('Course name can not be empty!')
  .escape(),
  body('courseFees')
    .notEmpty()
    .withMessage('Course fees can not be empty!')
    .escape(), 
  body('teachersIds')
    .notEmpty()
    .withMessage('Teachers can not be empty!')
    .escape(),
  courseController.updateCourse as Application
);

/**
 * Delete course
 * 
 * @route DELETE /courseRoutes/:courseId
 */
router.delete('/:courseId', courseController.deleteCourse as Application);

export default router;
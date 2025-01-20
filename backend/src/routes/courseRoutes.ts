import { Application, Router } from 'express';

import { body } from 'express-validator';

import * as courseController from 'src/controllers/course/courseController';

const router = Router();

/**
 * @openapi
 * /courses:
 *   get:
 *     tags:
 *       - Course Controller
 *     summary: Get a list of courses
 *     responses:
 *       200:
 *         description: Courses Fetched Successfully!
 *       500:
 *         description: Server error
 */
router.get('', courseController.getCourses as Application);

/**
 * @openapi
 * /courses/{courseId}:
 *   get:
 *     tags:
 *       - Course Controller
 *     summary: Get a course
 *     parameters:
 *       - name: courseId
 *         in: path
 *         description: course ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Courses Fetched Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.get('/:courseId', courseController.getCourse as Application);

/**
 * @openapi
 * /courses/create:
 *   post:
 *     tags:
 *       - Course Controller
 *     summary: Create a course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseName
 *               - courseFees
 *               - teacherId
 *             properties:
 *               courseName:
 *                 type: string
 *               courseFees:
 *                 type: number
 *               teacherId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created successfully!
 *       500:
 *         description: Server error
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
 * @route PATCH /courses/:courseId
 */
/**
 * @openapi
 * /courses/{courseId}:
 *   patch:
 *     tags:
 *       - Course Controller
 *     summary: Update course
 *     parameters:
 *       - name: courseId
 *         in: path
 *         description: course ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseName
 *               - courseFees
 *               - teacherId
 *             properties:
 *               courseName:
 *                 type: string
 *               courseFees:
 *                 type: number
 *               teacherId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course Updated Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
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
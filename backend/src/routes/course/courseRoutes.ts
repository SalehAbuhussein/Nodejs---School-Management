import { Application, Router } from 'express';

import { body, param } from 'express-validator';

import { handleValidation } from 'src/middlewares/validatorsMiddleware';

import * as courseController from 'src/controllers/course/courseController';

import { checkCourseExist } from './courseValidator';
import { checkTeacherExist, checkTeachersExist } from 'src/routes/teacher/teacherValidator';
import { isObjectId, isObjectIds, removeDuplicates } from 'src/validators';

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
router.get('/:courseId',
  param('courseId')
    .trim()
    .notEmpty()
    .withMessage('course id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(checkCourseExist),
  handleValidation as Application,
  courseController.getCourse as Application
);

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
    .trim()
    .notEmpty()
    .withMessage('Course name can not be empty!'),
  body('courseFees')
    .trim()
    .notEmpty()
    .withMessage('Course fees can not be empty!')
    .bail()
    .isFloat({ min: 0 })
    .withMessage('Course fees must be a valid number')
    .bail()
    .customSanitizer(fees => parseFloat(fees).toFixed(2)),
  body('teacherId')
    .trim()
    .notEmpty()
    .withMessage('Course can not be created without teacher!')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(checkTeacherExist),
  handleValidation as Application,
  courseController.createCourse as Application
);

// TODO: This needs to be tested
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
  param('courseId')
    .trim()
    .notEmpty()
    .withMessage('course id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(checkCourseExist),
  body('courseName')
    .trim()
    .notEmpty()
    .withMessage('Course name can not be empty!'),
  body('courseFees')
    .trim()
    .notEmpty()
    .withMessage('Course fees can not be empty!'), 
  body('teachersIds')
    .isArray({ min: 1 })
    .withMessage('Teachers can not be empty!')
    .customSanitizer(teachersIds => removeDuplicates<string>(teachersIds))
    .bail()
    .custom(isObjectIds)
    .bail()
    .custom(checkTeachersExist),
  handleValidation as Application,
  courseController.updateCourse as Application
);

/**
 * Delete course
 * 
 * @route DELETE /courseRoutes/:courseId
 */
router.delete('/:courseId',
  param('courseId')
    .trim()
    .notEmpty()
    .withMessage('course id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(checkCourseExist),
  courseController.deleteCourse as Application
);

export default router;
import { Application, Router } from 'express';

import { body } from 'express-validator';

import * as teacherController from '../controllers/teacher/teacherController';

const router = Router();

/**
 * Get a list of Teachers
 * 
 * @route GET /teachers
 */
router.get('', teacherController.getTeachers as Application);

/**
 * Get a single Teacher
 * 
 * @route GET /teachers/teacherId
 */
router.get('/:teacherId', teacherController.getTeacher as Application);

/**
 * Create a single Teacher
 * 
 * @route POST /teachers/create
 */
router.post('/create',
  body('firstName')
    .notEmpty()
    .withMessage('First name can not be empty!')
    .escape(),
  body('secondName')
    .notEmpty()
    .withMessage('Second name can not be empty!')
    .escape(),
  body('thirdName')
    .notEmpty()
    .withMessage('Second name can not be empty!')
    .escape(),
  body('lastName')
    .notEmpty()
    .withMessage('Last name can not be empty!')
    .escape(),
  body('userId')
    .notEmpty()
    .withMessage('User id can not be empty!')
    .escape(),
  teacherController.createTeacher as Application
);

/**
 * Update a single Teacher
 * 
 * @router PATCH /teachers/:teacherId
 */
router.patch('/:teacherId',
  body('firstName')
    .notEmpty()
    .withMessage('First name can not be empty!')
    .escape(),
  body('secondName')
    .notEmpty()
    .withMessage('Second name can not be empty!')
    .escape(),
  body('thirdName')
    .notEmpty()
    .withMessage('Second name can not be empty!')
    .escape(),
  body('lastName')
    .notEmpty()
    .withMessage('Last name can not be empty!')
    .escape(),
  body('userId')
    .notEmpty()
    .withMessage('User id can not be empty!')
    .escape(),
  teacherController.updateTeacher as Application
);

/**
 * Delete a single Teacher
 * 
 * @router DELETE /teachers/:teacherId
 */
router.delete('/:teacherId', teacherController.deleteTeacher as Application);

export default router;
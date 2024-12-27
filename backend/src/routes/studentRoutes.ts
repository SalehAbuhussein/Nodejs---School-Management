import { Application, Router } from 'express';

import { body } from 'express-validator';

import * as studentController from '../controllers/student/studentController';

const router = Router();

/**
 * Get a list of students
 * 
 * @route GET /students
 */
router.get('', studentController.getStudents as Application);

/**
 * Get a single student
 * 
 * @route GET /students/:studentId
 */
router.get('/:studentId', studentController.getStudent as Application);

/**
 * Create student
 * 
 * @route POST /students/create
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
  studentController.createStudent as Application
);

/**
 * Update student
 * 
 * @route PATCH /students/:studentId
 */
router.patch('/:studentId',
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
  studentController.updateStudent as Application
);

/**
 * Delete student
 * 
 * @route DELETE /students/:studentId
 */
router.delete('/:studentId', studentController.deleteStudent as Application);

export default router;
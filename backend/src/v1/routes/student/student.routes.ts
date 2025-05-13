import { Application, Router } from 'express';

import { body, param } from 'express-validator';

import * as studentController from 'src/v1/controllers/student/studentController';

import * as StudentService from 'src/v1/services/studentService';
import * as UserService from 'src/v1/services/userService';

import { handleValidation } from 'src/middlewares/validators.middleware';

import { isObjectId } from 'src/shared/validators';

const router = Router();

// prettier-ignore
/**
 * @openapi
 * /students/{studentId}:
 *   get:
 *     tags:
 *       - Student Controller
 *     summary: Get a student
 *     parameters:
 *       - name: studentId
 *         in: path
 *         description: student ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student Fetched Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server Error
 */
router.get('/:studentId',
  param('studentId')
    .trim()
    .notEmpty()
    .withMessage('student id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(StudentService.checkStudentExists),
  handleValidation as Application,
  studentController.getStudent as Application
);

// prettier-ignore
/**
 * @openapi
 * /students:
 *   post:
 *     tags:
 *       - Student Controller
 *     summary: Create a student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - secondName
 *               - thirdName
 *               - lastName
 *               - userId
 *             properties:
 *               firstName:
 *                 type: string
 *                 default: john
 *               secondName:
 *                 type: string
 *                 default: doe
 *               thirdName:
 *                 type: string
 *                 default: thirdDoe
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student Created Successfully
 *       500:
 *         description: Server error
 */
router.post('/',
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name can not be empty!'),
  body('secondName')
    .trim()
    .notEmpty()
    .withMessage('Second name can not be empty!'),
  body('thirdName')
    .trim()
    .notEmpty()
    .withMessage('Second name can not be empty!'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name can not be empty!'),
  body('userId')
    .trim()
    .notEmpty()
    .withMessage('User id can not be empty')
    .bail()
    .custom(UserService.checkUserExists),
  handleValidation as Application,
  studentController.createStudent as Application
);

// prettier-ignore
/**
 * @openapi
 * /students/{studentId}:
 *   patch:
 *     tags:
 *       - Student Controller
 *     summary: Update a student
 *     parameters:
 *       - name: studentId
 *         in: path
 *         description: studentId ID
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
 *               - firstName
 *               - secondName
 *               - thirdName
 *               - lastName
 *               - userId
 *             properties:
 *               firstName:
 *                 type: string
 *               secondName:
 *                 type: string
 *               thirdName:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student Updated Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.patch('/:studentId',
  param('studentId')
    .trim()
    .notEmpty()
    .withMessage('student id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(StudentService.checkStudentExists),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name can not be empty!'),
  body('secondName')
    .trim()
    .notEmpty()
    .withMessage('Second name can not be empty!'),
  body('thirdName')
    .trim()
    .notEmpty()
    .withMessage('Second name can not be empty!'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name can not be empty!'),
  body('userId')
    .trim()
    .notEmpty()
    .withMessage('User id can not be empty!')
    .custom(UserService.checkUserExists),
  handleValidation as Application,
  studentController.updateStudent as Application
);

// prettier-ignore
/**
 * @openapi
 * /students/{studentId}:
 *   delete:
 *     tags:
 *       - Student Controller
 *     summary: Delete student
 *     parameters:
 *       - name: studentId
 *         in: path
 *         description: studentId ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student Deleted Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.delete('/:studentId',
  param('studentId')
    .trim()
    .notEmpty()
    .withMessage('student id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(StudentService.checkStudentExists),
  handleValidation as Application,
  studentController.deleteStudent as Application
);

export default router;

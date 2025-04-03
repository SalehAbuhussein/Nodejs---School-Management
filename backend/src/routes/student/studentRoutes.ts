import { Application, Router } from 'express';

import { body, param } from 'express-validator';

import * as studentController from 'src/controllers/student/studentController';

import { handleValidation } from 'src/middlewares/validatorsMiddleware';

import { isObjectId } from 'src/validators';
import { checkStudentExist } from 'src/routes/student/studentValidator';
import { checkUserExist } from '../user/userValidator';

const router = Router();

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
    .custom(checkStudentExist),
  handleValidation as Application,
  studentController.getStudent as Application
);

/**
 * @openapi
 * /students/create:
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
router.post('/create',
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
    .custom(checkUserExist),
  handleValidation as Application,
  studentController.createStudent as Application
);

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
    .custom(checkStudentExist),
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
    .custom(checkUserExist),
  handleValidation as Application,
  studentController.updateStudent as Application
);

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
    .custom(checkStudentExist),
  handleValidation as Application,
  studentController.deleteStudent as Application
);

export default router;
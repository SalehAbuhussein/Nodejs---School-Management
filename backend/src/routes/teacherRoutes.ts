import { Application, Router } from 'express';

import { body } from 'express-validator';

import * as teacherController from '../controllers/teacher/teacherController';

const router = Router();

/**
 * @openapi
 * /teachers:
 *   get:
 *     tags:
 *       - Teacher Controller
 *     summary: Get a list of Teachers
 *     responses:
 *       200:
 *         description: Teachers Fetched Successfully!
 *       500:
 *         description: Server Error
 */
router.get('', teacherController.getTeachers as Application);

/**
 * @openapi
 * /teachers/{teacherId}:
 *   get:
 *     tags:
 *       - Teacher Controller
 *     summary: Get a single Teacher
 *     parameters:
 *       - name: teacherId
 *         in: path
 *         description: The teacher ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher Fetched Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server Error
 */
router.get('/:teacherId', teacherController.getTeacher as Application);

/**
 * @openapi
 * /users/create:
 *   post:
 *     tags:
 *       - Teacher Controller
 *     summary: Create a new Teacher
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
 *                 default: johndoe
 *               secondName:
 *                 type: string
 *                 default: secondName
 *               thirdName:
 *                 type: string
 *                 default: thirdName
 *               lastName:
 *                 type: string
 *                 default: lastName
 *               userId:
 *                 type: string
 *                 default: asd45646
 *     responses:
 *       201:
 *         description: Teacher Created Successfully
 *       500:
 *         description: Server error
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
 * @openapi
 * /teachers/{teacherId}:
 *   patch:
 *     tags:
 *       - Teacher Controller
 *     summary: Update a Teacher
 *     parameters:
 *       - name: teacherId
 *         in: path
 *         description: The Teacher ID
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
 *                 default: johndoe
 *               secondName:
 *                 type: string
 *                 default: secondName
 *               thirdName:
 *                 type: string
 *                 default: thirdName
 *               lastName:
 *                 type: string
 *                 default: lastName
 *               userId:
 *                 type: string
 *                 default: asd45646
 *     responses:
 *       200:
 *         description: Teacher Updated Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
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
 * @openapi
 * /users/{teacherId}:
 *   delete:
 *     tags:
 *       - Teacher Controller
 *     summary: Delete a Teacher
 *     parameters:
 *       - name: teacherId
 *         in: path
 *         description: Teacher Id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher Deleted Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.delete('/:teacherId', teacherController.deleteTeacher as Application);

export default router;
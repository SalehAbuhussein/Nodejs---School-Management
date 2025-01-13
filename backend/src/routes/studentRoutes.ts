import { Application, Router } from 'express';

import { body } from 'express-validator';

import * as studentController from '../controllers/student/studentController';

const router = Router();

/**
 * @openapi
 * /students:
 *   get:
 *     tags:
 *       - Student Controller
 *     summary: Get a list of students
 *     responses:
 *       200:
 *         description: Students Fetched Successfully!
 *       500:
 *         description: Server Error
 */
router.get('', studentController.getStudents as Application);

/**
 * @openapi
 * /students/{studentId}
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
router.get('/:studentId', studentController.getStudent as Application);

/**
 * Create student
 * 
 * @route POST /students/create
 */
/**
 * @openapi
 * /studentTiers/create:
 *   post:
 *     tags:
 *       - StudentTier Controller
 *     summary: Create student tier
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
router.delete('/:studentId', studentController.deleteStudent as Application);

export default router;
import { Application, Router } from 'express';

import { body, param } from 'express-validator';

import * as examController from 'src/controllers/studentExam/studentExamController';

import { checkStudentExamExist } from 'src/routes/studentExam/studentExamValidator';
import { handleValidation } from 'src/middlewares/validatorsMiddleware';
import { isObjectId } from 'src/validators';

const router = Router();

/**
 * @openapi
 * /studentExams:
 *   get:
 *     tags:
 *       - Exam Controller
 *     summary: Get a list of student exams
 *     responses:
 *       200:
 *         description: Exams Fetched Successfully!
 *       500:
 *         description: Server error
 */
router.get('', examController.getExams as Application);

/**
 * @openapi
 * /studentExams/{examId}:
 *   get:
 *     tags:
 *       - Exam Controller
 *     summary: Get exam
 *     parameters:
 *       - name: examId
 *         in: path
 *         description: exam ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam fetched successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.get('/:examId',
  param('examId')
    .custom(isObjectId)
    .bail()
    .custom(checkStudentExamExist),
  handleValidation as Application,
  examController.getExam as Application
);

/**
 * @openapi
 * /studentExams/create:
 *   post:
 *     tags:
 *       - Exam Controller
 *     summary: Create exam
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - studentGrade
 *               - fullExamGrade
 *               - subjectId
 *               - examTypeId
 *             properties:
 *               title:
 *                 type: string
 *               studentGrade:
 *                 type: number
 *               fullExamGrade:
 *                 type: number
 *               subjectId:
 *                 type: string
 *               examTypeId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Exam created successfully!
 *       500:
 *         description: Server error
 */
router.post('/create',
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title can not be empty!'),
  body('studentGrade')
    .trim()
    .notEmpty()
    .withMessage('Student grade can not be empty!'),
  body('fullExamGrade')
    .trim()
    .notEmpty()
    .withMessage('Full exam grade can not be empty!'),
  body('subjectId')
    .trim()
    .notEmpty()
    .withMessage('Subject Id can not be empty!'),
  body('examTypeId')
    .trim()
    .notEmpty()
    .withMessage('Exam type Id can not be empty!'),
  handleValidation as Application,
  examController.createExam as Application
);

/**
 * @openapi
 * /studentExams/{examId}:
 *   patch:
 *     tags:
 *       - Exam Controller
 *     summary: Update exam
 *     parameters:
 *       - name: examId
 *         in: path
 *         description: exam ID
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
 *               - title
 *               - studentGrade
 *               - fullExamGrade
 *               - subjectId
 *               - examTypeId
 *             properties:
 *               title:
 *                 type: string
 *               studentGrade:
 *                 type: number
 *               fullExamGrade:
 *                 type: number
 *               subjectId:
 *                 type: string
 *               examTypeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Exam Updated Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.patch('/:examId',
  param('examId')
    .trim()
    .notEmpty()
    .withMessage('exam id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(checkStudentExamExist),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title can not be empty!'),
  body('studentGrade')
    .trim()
    .notEmpty()
    .withMessage('Student grade can not be empty!'),
  body('fullExamGrade')
    .trim()
    .notEmpty()
    .withMessage('Full exam grade can not be empty!'),
  body('subjectId')
    .trim()
    .notEmpty()
    .withMessage('Subject Id can not be empty!'),
  body('examTypeId')
    .trim()
    .notEmpty()
    .withMessage('Exam type Id can not be empty!'),
  handleValidation as Application,
  examController.updateExam as Application
);

/**
 * Delete exam
 * 
 * @route DELETE /exams/:examId
 */
router.delete('/:examId',
  param('examId')
    .trim()
    .notEmpty()
    .withMessage('exam id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(checkStudentExamExist),
  handleValidation as Application,
  examController.deleteExam as Application
);

export default router;
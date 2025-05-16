import { Application, Router } from 'express';

import { body, param } from 'express-validator';

import * as examController from 'src/v1/controllers/studentExam/studentExamController';

import * as StudentExamService from 'src/v1/services/studentExamService';

import { handleValidation } from 'src/shared/middlewares/validators.middleware';

const router = Router();

// prettier-ignore
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
    .trim()
    .notEmpty()
    .withMessage('exam id can not be empty')
    .bail()
    .isMongoId()
    .withMessage('exam id is not valid'),
  handleValidation as Application,
  examController.getExam as Application
);

// prettier-ignore
/**
 * @openapi
 * /studentExams:
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
router.post('/',
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
  handleValidation as Application,
  examController.createExam as Application
);

// prettier-ignore
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
    .isMongoId()
    .withMessage('exam id is not valid'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title can not be empty!'),
  body('studentGrade')
    .trim()
    .notEmpty()
    .withMessage('Student grade can not be empty!'),
  handleValidation as Application,
  examController.updateExam as Application
);

// prettier-ignore
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
    .isMongoId()
    .withMessage('exam id is not valid'),
  handleValidation as Application,
  examController.deleteExam as Application
);

// prettier-ignore
router.post('/:teacherExamId/take',
  param('teacherExamId')
    .trim()
    .notEmpty()
    .withMessage('Exam ID cannot be empty')
    .bail()
    .isMongoId()
    .withMessage('Exam ID is not valid')
    .bail()
    .custom(StudentExamService.checkExamExists),
  body('studentId')
    .trim()
    .notEmpty()
    .withMessage('Student ID cannot be empty')
    .bail()
    .isMongoId()
    .withMessage('Student ID is not valid'),
  body('grade')
    .isNumeric()
    .withMessage('Grade must be a number'),
  body('semester')
    .trim()
    .notEmpty()
    .withMessage('Semester cannot be empty')
    .isIn(['First', 'Second'])
    .withMessage('Semester must be either "First" or "Second"'),
  body('year')
    .isNumeric()
    .withMessage('Year must be a number'),
  handleValidation as Application,
  examController.takeExam as Application
);

export default router;

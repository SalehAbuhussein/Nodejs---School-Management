import { Application, Router } from 'express';

import { body } from 'express-validator';

import * as examController from 'src/controllers/exam/examController';

const router = Router();

/**
 * @openapi
 * /exams:
 *   get:
 *     tags:
 *       - Exam Controller
 *     summary: Get a list of exams
 *     responses:
 *       200:
 *         description: Exams Fetched Successfully!
 *       500:
 *         description: Server error
 */
router.get('', examController.getExams as Application);

/**
 * @openapi
 * /exams/{examId}:
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
router.get('/:examId', examController.getExam as Application);

/**
 * @openapi
 * /exams/create:
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
 *               - courseId
 *               - examTypeId
 *             properties:
 *               title:
 *                 type: string
 *               studentGrade:
 *                 type: number
 *               fullExamGrade:
 *                 type: number
 *               courseId:
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
    .notEmpty()
    .withMessage('Title can not be empty!')
    .escape(),
  body('studentGrade')
    .notEmpty()
    .withMessage('Student grade can not be empty!')
    .escape(),
  body('fullExamGrade')
    .notEmpty()
    .withMessage('Full exam grade can not be empty!')
    .escape(),
  body('courseId')
    .notEmpty()
    .withMessage('Course Id can not be empty!')
    .escape(),
  body('examTypeId')
    .notEmpty()
    .withMessage('Exam type Id can not be empty!')
    .escape(),
  examController.createExam as Application
);

/**
 * @openapi
 * /exams/{examId}:
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
 *               - courseId
 *               - examTypeId
 *             properties:
 *               title:
 *                 type: string
 *               studentGrade:
 *                 type: number
 *               fullExamGrade:
 *                 type: number
 *               courseId:
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
  body('title')
    .notEmpty()
    .withMessage('Title can not be empty!')
    .escape(),
  body('studentGrade')
    .notEmpty()
    .withMessage('Student grade can not be empty!')
    .escape(),
  body('fullExamGrade')
    .notEmpty()
    .withMessage('Full exam grade can not be empty!')
    .escape(),
  body('courseId')
    .notEmpty()
    .withMessage('Course Id can not be empty!')
    .escape(),
  body('examTypeId')
    .notEmpty()
    .withMessage('Exam type Id can not be empty!')
    .escape(),
  examController.updateExam as Application
);

/**
 * Delete exam
 * 
 * @route DELETE /exams/:examId
 */
router.delete('/:examId', examController.deleteExam as Application);

export default router;
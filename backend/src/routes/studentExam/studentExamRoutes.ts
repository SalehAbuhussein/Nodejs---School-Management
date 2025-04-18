import { Application, Router } from 'express';

import { body, param } from 'express-validator';

import * as examController from 'src/controllers/studentExam/studentExamController';

import { checkStudentExamExist } from 'src/routes/studentExam/studentExamValidator';
import { handleValidation } from 'src/middlewares/validatorsMiddleware';
import { isObjectId } from 'src/validators';
import { checkTeacherExamExist } from '../teacherExam/teacherExamValidator';

const router = Router();

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

router.post('/:teacherExamId/take',
  param('teacherExamId')
    .trim()
    .notEmpty()
    .withMessage('Exam ID cannot be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(checkTeacherExamExist),
  body('studentId')
    .trim()
    .notEmpty()
    .withMessage('Student ID cannot be empty')
    .bail()
    .custom(isObjectId),
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
)

export default router;
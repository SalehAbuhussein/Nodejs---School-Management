import { Application, Router } from 'express';

import { body, param } from 'express-validator';

import * as TeacherExamController from 'src/v1/controllers/teacherExam/teacherExamController';

import { handleValidation } from 'src/shared/middlewares/validators.middleware';

const router = Router();

// prettier-ignore
/**
 * @openapi
 * /teacherExams/{examId}:
 *   get:
 *     tags:
 *       - Exam Controller
 *     summary: Get Teacher exam (parent of student exam)
 *     parameters:
 *       - name: examId
 *         in: path
 *         description: teacher exam ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher Exam fetched successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.get('/:examId',
  param('examId')
    .trim()
    .notEmpty()
    .withMessage('exam id can not be empty!')
    .isMongoId()
    .withMessage('exam id must be a valid mongo id'),
  handleValidation as Application,
  TeacherExamController.getTeacherExam as Application,
);

// prettier-ignore
router.post('/',
  body('title')
    .trim()
    .notEmpty()
    .withMessage('title can not be empty!'),
  body('examTypeId')
    .trim()
    .notEmpty()
    .withMessage('exam type id can not be empty!')
    .bail()
    .isMongoId()
    .withMessage('exam type id must be a mongo id'),
  body('examId')
    .trim()
    .notEmpty()
    .withMessage('exam id can not be empty!')
    .bail()
    .isMongoId()
    .withMessage('exam id must be a valid id'),
  body('fullExamGrade')
    .trim()
    .notEmpty()
    .withMessage('grade can not be empty!')
    .bail()
    .isFloat()
    .withMessage('grade must be number!'),
  handleValidation as Application,
  TeacherExamController.createTeacherExam as Application,
);

// prettier-ignore
router.patch('/:examId',
  body('title')
    .trim()
    .notEmpty()
    .withMessage('title can not be empty!'),
  body('fullExamGrade')
    .trim()
    .notEmpty()
    .withMessage('grade can not be empty!')
    .bail()
    .isFloat()
    .withMessage('grade must be number!'),
  handleValidation as Application,
  TeacherExamController.updateTeacherExam as Application,
);

export default router;

import { Application, Router } from 'express';

import { body, param } from 'express-validator';

import * as TeacherExamController from 'src/v1/controllers/teacherExam/teacherExamController';

import * as ExamTypeService from 'src/v1/services/examTypeService';
import * as StudentExamService from 'src/v1/services/studentExamService';

import { handleValidation } from 'src/middlewares/validators.middleware';
import { isObjectId } from 'src/shared/validators';

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
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(StudentExamService.checkExamExists),
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
    .custom(isObjectId)
    .bail()
    .custom(ExamTypeService.checkExamTypeExists),
  body('examId')
    .trim()
    .notEmpty()
    .withMessage('exam id can not be empty!')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(StudentExamService.checkExamExists),
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

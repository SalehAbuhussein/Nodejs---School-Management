import { Application, Router } from 'express';

import { body, param } from 'express-validator';

import * as TeacherExamController from 'src/controllers/teacherExam/teacherExamController';

// import * from 'src/routes/teacherExam/teacherExamValidator';
import { checkExamTypeExist } from 'src/routes/examType/examTypeValidator';
import { checkStudentExamExist } from 'src/routes/studentExam/studentExamValidator';
import { handleValidation } from 'src/middlewares/validatorsMiddleware';
import { isObjectId } from 'src/validators';

const router = Router();

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
    .custom(checkStudentExamExist),
  handleValidation as Application,
  TeacherExamController.getTeacherExam as Application,
);

router.post('create',
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
    .custom(checkExamTypeExist),
  body('examId')
    .trim()
    .notEmpty()
    .withMessage('exam id can not be empty!')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(checkStudentExamExist),
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

router.patch('/:examId',
  param('examId')
    .trim()
    .notEmpty()
    .withMessage('exam id can not be empty!')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(checkStudentExamExist),
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
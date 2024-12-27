import { Application, Router } from 'express';

import { body } from 'express-validator';

import * as examController from '../controllers/exam/examController';

const router = Router();

/**
 * Get a list of exams
 * 
 * @route GET /exams
 */
router.get('', examController.getExams as Application);

/**
 * Get a single exam
 * 
 * @route GET /exams/:examId
 */
router.get('/:examId', examController.getExam as Application);

/**
 * Create exam
 * 
 * @route POST /exams/create
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
 * Update exam
 * 
 * @route PATCH /exams/create
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
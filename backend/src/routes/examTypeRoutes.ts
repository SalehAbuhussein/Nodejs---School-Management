import { Application, Router } from 'express';

import { body } from 'express-validator';

import * as examTypeController from '../controllers/examType/examTypeController';

const router = Router();

/**
 * Get a list of exam types
 * 
 * @route GET /examTypes
 */
router.get('', examTypeController.getExamTypes as Application);

/**
 * Get a single exam type
 * 
 * @route GET /examTypes/:examTypeId
 */
router.get('/:examTypeId', examTypeController.getExamType as Application);

/**
 * Create exam type
 * 
 * @route POST /examTypes/create
 */
router.post('/create',
  body('name')
    .notEmpty()
    .withMessage('name can not be empty!')
    .escape(), 
  examTypeController.createExamType as Application
);

/**
 * Update exam type
 * 
 * @route PATCH /examTypes/:examTypeId
 */
router.patch('/:examTypeId',
  body('name')
    .notEmpty()
    .withMessage('name can not be empty!')
    .escape(),
  examTypeController.updateExamType as Application
);

/**
 * Delete exam type
 * 
 * @route DELETE /examTypes/:examTypeId
 */
router.delete('/:examTypeId', examTypeController.deleteExamType as Application);

export default router;
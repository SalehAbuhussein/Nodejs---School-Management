import { Router, Application } from 'express';
import { body, param } from 'express-validator';

import * as enrollmentController from 'src/v1/controllers/enrollment/enrollmentController';

import { handleValidation } from 'src/shared/middlewares/validators.middleware';

const router = Router();

// prettier-ignore
router.post('/',
  body('studentId')
    .trim()
    .notEmpty()
    .withMessage('student id can not be empty')
    .bail()
    .isMongoId()
    .withMessage('student id must valid id'),
  body('subjectId')
    .trim()
    .notEmpty()
    .withMessage('subject id can not be empty')
    .bail()
    .isMongoId()
    .withMessage('subject id must valid id'),
  body('enrollmentFees')
    .trim()
    .notEmpty()
    .withMessage('Subject fees can not be empty!')
    .bail()
    .isFloat({ min: 0 })
    .withMessage('Subject fees must be a valid number')
    .bail()
    .customSanitizer(fees => parseFloat(fees).toFixed(2)),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('it should be boolean'),
  body('enrollmentDate')
    .optional()
    .isDate()
    .withMessage('it should be valid date'),
  body('semester')
    .optional()
    .isIn(['First', 'Second'])
    .withMessage('semester should be valid'),
  handleValidation as Application,
  enrollmentController.enrollStudent as Application,
);

// prettier-ignore
router.delete(
  '/:enrollmentId',
  param('enrollmentId')
    .trim()
    .notEmpty()
    .withMessage('enrollment id can not be empty')
    .bail()
    .isMongoId(),
  handleValidation as Application,
  enrollmentController.unenrollStudent as Application,
);
export default router;

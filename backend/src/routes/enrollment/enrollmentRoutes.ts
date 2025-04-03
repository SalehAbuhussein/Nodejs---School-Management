import { Router, Application } from 'express';
import { body, param } from 'express-validator';

import * as enrollmentController from 'src/controllers/enrollment/enrollmentController'

import { checkSubjectExist, checkSubjectIsAvailable } from 'src/routes/subject/subjectValidator';
import { checkDuplicateEnrollment, checkEnrollmentExist } from 'src/routes/enrollment/enrollmentValidator';
import { checkStudentExist } from 'src/routes/student/studentValidator';
import { handleValidation } from 'src/middlewares/validatorsMiddleware';
import { isObjectId } from 'src/validators';

const router = Router();

router.post('/create',
  body('studentId')
    .trim()
    .notEmpty()
    .withMessage('student id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(checkStudentExist),
  body('subjectId')
    .trim()
    .notEmpty()
    .withMessage('subject id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(checkSubjectExist)
    .bail()
    .custom(checkSubjectIsAvailable)
    .bail()
    .custom((_, { req }) => checkDuplicateEnrollment(req.body.studentId, req.body.subjectId)),
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

router.delete(
  '/:enrollmentId',
  param('enrollmentId')
    .trim()
    .notEmpty()
    .withMessage('enrollment id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(checkEnrollmentExist),
  handleValidation as Application,
  enrollmentController.unenrollStudent as Application,
);
export default router;
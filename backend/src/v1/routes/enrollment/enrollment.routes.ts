import { Router, Application } from 'express';
import { body, param } from 'express-validator';

import * as enrollmentController from 'src/v1/controllers/enrollment/enrollmentController';

import * as EnrollmentService from 'src/v1/services/enrollmentService';
import * as StudentService from 'src/v1/services/studentService';
import * as SubjectService from 'src/v1/services/subjectService';

import { handleValidation } from 'src/shared/middlewares/validators.middleware';
import { isObjectId } from 'src/shared/validators';

const router = Router();

// prettier-ignore
router.post('/',
  body('studentId')
    .trim()
    .notEmpty()
    .withMessage('student id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(StudentService.checkStudentExists),
  body('subjectId')
    .trim()
    .notEmpty()
    .withMessage('subject id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(SubjectService.checkSubjectExists)
    .bail()
    .custom(SubjectService.checkSubjectIsAvailable)
    .bail()
    .custom((_, { req }) => EnrollmentService.checkDuplicateEnrollment(req.body.studentId, req.body.subjectId))
    .withMessage('enrollement already exist'),
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
    .custom(isObjectId)
    .bail()
    .custom(enrollmentId => EnrollmentService.checkEnrollmentExist(enrollmentId))
    .withMessage('enrollment not found'),
  handleValidation as Application,
  enrollmentController.unenrollStudent as Application,
);
export default router;

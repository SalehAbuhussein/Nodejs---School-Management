import { Router, Application } from 'express';
import { body, param } from 'express-validator';

import * as enrollmentController from 'src/controllers/enrollment/enrollmentController'

import { checkCourseExist, checkCourseIsAvailable } from 'src/routes/course/courseValidator';
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
  body('courseId')
    .trim()
    .notEmpty()
    .withMessage('course id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(checkCourseExist)
    .bail()
    .custom(checkCourseIsAvailable)
    .bail()
    .custom((_, { req }) => checkDuplicateEnrollment(req.body.studentId, req.body.courseId)),
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
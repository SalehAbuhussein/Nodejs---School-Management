import { Application, Router } from 'express';

import { body, param } from 'express-validator';

import { handleValidation } from 'src/middlewares/validatorsMiddleware';

import * as subjectController from 'src/controllers/subject/subjectController';

import { checkSubjectExist } from './subjectValidator';
import { checkTeacherExist, checkTeachersExist } from 'src/routes/teacher/teacherValidator';
import { isObjectId, isObjectIds, removeDuplicates } from 'src/validators';

const router = Router();

/**
 * @openapi
 * /subjects:
 *   get:
 *     tags:
 *       - Subject Controller
 *     summary: Get a list of subjects
 *     responses:
 *       200:
 *         description: Subjects Fetched Successfully!
 *       500:
 *         description: Server error
 */
router.get('', subjectController.getSubjects as Application);

/**
 * @openapi
 * /subjects/{subjectId}:
 *   get:
 *     tags:
 *       - Subject Controller
 *     summary: Get a Subject
 *     parameters:
 *       - name: subjectId
 *         in: path
 *         description: subject ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subject Fetched Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.get('/:subjectId',
  param('subjectId')
    .trim()
    .notEmpty()
    .withMessage('subject id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(checkSubjectExist),
  handleValidation as Application,
  subjectController.getSubject as Application
);

/**
 * @openapi
 * /subjects/create:
 *   post:
 *     tags:
 *       - Subject Controller
 *     summary: Create a Subject
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - teacherId
 *             properties:
 *               name:
 *                 type: string
 *               teacherId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subject created successfully!
 *       500:
 *         description: Server error
 */
router.post('/create',
  body('name')
    .trim()
    .notEmpty()
    .withMessage('name can not be empty!'),
  body('teacherId')
    .trim()
    .notEmpty()
    .withMessage('can not be created without teacher!')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(checkTeacherExist),
  body('totalSlots')
    .trim()
    .notEmpty()
    .withMessage('slots should not be empty')
    .bail()
    .isInt({ min: 1 })
    .withMessage('slots should be valid number'),
  handleValidation as Application,
  subjectController.createSubject as Application
);

// TODO: This needs to be tested
/**
 * @openapi
 * /subjects/{subjectId}:
 *   patch:
 *     tags:
 *       - Subject Controller
 *     summary: Update subject
 *     parameters:
 *       - name: subjectId
 *         in: path
 *         description: Subject ID
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
 *               - name
 *               - teacherId
 *             properties:
 *               name:
 *                 type: string
 *               teacherId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subject Updated Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.patch('/:subjectId',
  param('subjectId')
    .trim()
    .notEmpty()
    .withMessage('Subject id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(checkSubjectExist),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Subject name can not be empty!'),
  body('teachersIds')
    .isArray({ min: 1 })
    .withMessage('Teachers can not be empty!')
    .customSanitizer(teachersIds => removeDuplicates<string>(teachersIds))
    .bail()
    .custom(isObjectIds)
    .bail()
    .custom(checkTeachersExist),
  handleValidation as Application,
  subjectController.updateSubject as Application
);

/**
 * Delete subject
 * 
 * @route DELETE /subjects/:subjectId
 */
router.delete('/:subjectId',
  param('subjectId')
    .trim()
    .notEmpty()
    .withMessage('subject id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(checkSubjectExist),
  subjectController.deleteSubject as Application
);

export default router;
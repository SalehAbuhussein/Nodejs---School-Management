import { Application, Router } from 'express';

import { body, param } from 'express-validator';

import * as subjectController from 'src/v1/controllers/subject/subjectController';

import * as SubjectService from 'src/v1/services/subjectService';
import * as TeacherService from 'src/v1/services/teacherService';

import { handleValidation } from 'src/middlewares/validators.middleware';

import { isObjectId, isObjectIds } from 'src/shared/validators';

const router = Router();

// prettier-ignore
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
    .custom(SubjectService.checkSubjectExists),
  handleValidation as Application,
  subjectController.getSubject as Application
);

// prettier-ignore
/**
 * @openapi
 * /subjects:
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
router.post('/',
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
    .custom(TeacherService.checkTeacherExists),
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

// prettier-ignore
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
    .custom(SubjectService.checkSubjectExists),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Subject name can not be empty!'),
  body('teachersIds')
    .isArray({ min: 1 })
    .withMessage('Teachers can not be empty!')
    .customSanitizer(teachersIds => [...(new Set(teachersIds))])
    .bail()
    .custom(isObjectIds)
    .bail()
    .custom(TeacherService.checkTeachersExists),
  handleValidation as Application,
  subjectController.updateSubject as Application
);

// prettier-ignore
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
    .custom(SubjectService.checkSubjectExists),
  subjectController.deleteSubject as Application
);

export default router;

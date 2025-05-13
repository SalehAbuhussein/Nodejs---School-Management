import { Application, Router } from 'express';

import { body, param } from 'express-validator';

import * as examTypeController from 'src/v1/controllers/examType/examTypeController';

import * as ExamTypeService from 'src/v1/services/examTypeService';

import { handleValidation } from 'src/shared/middlewares/validators.middleware';

import { isObjectId } from 'src/shared/validators';

const router = Router();

// prettier-ignore
/**
 * @openapi
 * /examTypes/{examTypeId}:
 *   get:
 *     tags:
 *       - ExamType Controller
 *     summary: Get exam type
 *     parameters:
 *       - name: examTypeId
 *         in: path
 *         description: exam type ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam type fetched successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.get('/:examTypeId',
  param('examTypeId')
    .trim()
    .notEmpty()
    .withMessage('exam type id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(ExamTypeService.checkExamTypeExists),
  handleValidation as Application,
  examTypeController.getExamType as Application
);

// prettier-ignore
/**
 * @openapi
 * /examTypes:
 *   post:
 *     tags:
 *       - ExamType Controller
 *     summary: Create exam type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Exam Type created successfully!
 *       500:
 *         description: Server error
 */
router.post('/',
  body('name')
    .trim()
    .notEmpty()
    .withMessage('name can not be empty!'),
  handleValidation as Application,
  examTypeController.createExamType as Application
);

// prettier-ignore
/**
 * @openapi
 * /examTypes/{examTypeId}:
 *   patch:
 *     tags:
 *       - ExamType Controller
 *     summary: Update exam type
 *     parameters:
 *       - name: examTypeId
 *         in: path
 *         description: exam type ID
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
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Exam type Updated Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.patch('/:examTypeId',
  param('examTypeId')
    .trim()
    .notEmpty()
    .withMessage('exam type id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(ExamTypeService.checkExamTypeExists),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('name can not be empty!'),
  handleValidation as Application,
  examTypeController.updateExamType as Application
);

// prettier-ignore
/**
 * @openapi
 * /examTypes/{examTypeId}:
 *   delete:
 *     tags:
 *       - ExamType Controller
 *     summary: Delete exam type
 *     parameters:
 *       - name: examTypeId
 *         in: path
 *         description: exam type ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exam type Deleted Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.delete('/:examTypeId', 
  param('examTypeId')
    .trim()
    .notEmpty()
    .withMessage('exam type id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(ExamTypeService.checkExamTypeExists),
  handleValidation as Application,
  examTypeController.deleteExamType as Application
);

export default router;

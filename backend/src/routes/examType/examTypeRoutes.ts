import { Application, Router } from 'express';

import { body, param } from 'express-validator';

import * as examTypeController from 'src/controllers/examType/examTypeController';

import { handleValidation } from 'src/middlewares/validatorsMiddleware';

import { isObjectId } from 'src/validators';
import { checkExamTypeExist } from 'src/routes/examType/examTypeValidator';

const router = Router();

/**
 * @openapi
 * /examTypes:
 *   get:
 *     tags:
 *       - ExamType Controller
 *     summary: Get a list of exam types
 *     responses:
 *       200:
 *         description: Exam types Fetched Successfully!
 *       500:
 *         description: Server error
 */
router.get('', examTypeController.getExamTypes as Application);

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
    .custom(checkExamTypeExist),
  handleValidation as Application,
  examTypeController.getExamType as Application
);

/**
 * @openapi
 * /examTypes/create:
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
router.post('/create',
  body('name')
    .trim()
    .notEmpty()
    .withMessage('name can not be empty!'),
  handleValidation as Application,
  examTypeController.createExamType as Application
);

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
    .custom(checkExamTypeExist),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('name can not be empty!'),
  handleValidation as Application,
  examTypeController.updateExamType as Application
);

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
    .custom(checkExamTypeExist),
  handleValidation as Application,
  examTypeController.deleteExamType as Application
);

export default router;
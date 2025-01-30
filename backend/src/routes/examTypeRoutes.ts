import { Application, Router } from 'express';

import { body } from 'express-validator';

import * as examTypeController from 'src/controllers/examType/examTypeController';

import { handleValidation } from 'src/shared/controllers/controllerValidator';

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
router.get('/:examTypeId', examTypeController.getExamType as Application);

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
    .isEmpty()
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
  body('name')
    .trim()
    .isEmpty()
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
router.delete('/:examTypeId', examTypeController.deleteExamType as Application);

export default router;
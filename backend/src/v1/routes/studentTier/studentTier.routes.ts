import { Application, Router } from 'express';

import { body, param } from 'express-validator';

import * as studentTierController from 'src/v1/controllers/studentTier/studentTierController';

import * as StudentTierService from 'src/v1/services/studentTierService';

import { handleValidation } from 'src/shared/middlewares/validators.middleware';

import { isObjectId } from 'src/shared/validators';

const router = Router();

// prettier-ignore
/**
 * @openapi
 * /studentTiers/{studentTierId}:
 *   get:
 *     tags:
 *       - StudentTier Controller
 *     summary: Get a student tier
 *     parameters:
 *       - name: studentTierId
 *         in: path
 *         description: student-tier ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student Tier Fetched Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server Error
 */
router.get('/:studentTierId',
  param('studentTierId')
    .notEmpty()
    .withMessage('student tier id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(StudentTierService.checkStudentTierExists),
  handleValidation as Application,
  studentTierController.getStudentTier as Application
);

// prettier-ignore
/**
 * @openapi
 * /studentTiers:
 *   post:
 *     tags:
 *       - StudentTier Controller
 *     summary: Create student tier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tierName
 *               - monthlySubscriptionFees
 *             properties:
 *               tierName:
 *                 type: string
 *                 default: tier-1
 *               monthlySubscriptionFees:
 *                 type: string
 *                 default: 60.50
 *     responses:
 *       201:
 *         description: Student Tier Created Successfully
 *       500:
 *         description: Server error
 */
router.post('/',
  body('tierName')
    .trim()
    .notEmpty()
    .withMessage('Tier name can not be empty!'),
  body('monthlySubscriptionFees')
    .trim()
    .notEmpty()
    .withMessage('Monthly subscription fees can not be empty!'),
  handleValidation as Application,
  studentTierController.createStudentTier as Application
);

// prettier-ignore
/**
 * @openapi
 * /studentTiers/{studentTierId}:
 *   patch:
 *     tags:
 *       - StudentTier Controller
 *     summary: Update a student-tier
 *     parameters:
 *       - name: studentTierId
 *         in: path
 *         description: student-tier ID
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
 *               - tierName
 *               - monthlySubscriptionFees
 *             properties:
 *               tierName:
 *                 type: string
 *               monthlySubscriptionFees:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student tier Updated Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.patch('/:studentTierId',
  param('studentTierId')
    .notEmpty()
    .withMessage('student tier id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(StudentTierService.checkStudentTierExists),
  body('tierName')
    .trim()
    .notEmpty()
    .withMessage('Tier name can not be empty!'),
  body('monthlySubscriptionFees')
    .trim()
    .notEmpty()
    .withMessage('Monthly subscription fees can not be empty!'),  
  handleValidation as Application,
  studentTierController.updateStudentTier as Application
);

// prettier-ignore
/**
 * @openapi
 * /studentTiers/{studentTierId}:
 *   delete:
 *     tags:
 *       - StudentTier Controller
 *     summary: Delete student-tier
 *     parameters:
 *       - name: studentTierId
 *         in: path
 *         description: student-tier ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Student Tier Deleted Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.delete('/:studentTierId',
  param('studentTierId')
    .notEmpty()
    .withMessage('student tier id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(StudentTierService.checkStudentTierExists),
  studentTierController.deleteStudentTier as Application
);

export default router;

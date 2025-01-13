import { Application, Router } from 'express';

import { body } from 'express-validator';

import * as studentTierController from '../controllers/studentTier/studentTierController';

const router = Router();

/**
 * @openapi
 * /studentTiers:
 *   get:
 *     tags:
 *       - StudentTier Controller
 *     summary: Get a list of student tiers
 *     responses:
 *       200:
 *         description: Student-tiers Fetched Successfully!
 *       500:
 *         description: Server Error
 */
router.get('', studentTierController.getStudentTiers as Application);

/**
 * @openapi
 * /studentTiers/{studentTierId}
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
router.get('/:studentTierId', studentTierController.getStudentTier as Application);

/**
 * @openapi
 * /studentTiers/create:
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
router.post('/create',
  body('tierName')
    .notEmpty()
    .withMessage('Tier name can not be empty!')
    .escape(),
  body('monthlySubscriptionFees')
    .notEmpty()
    .withMessage('Monthly subscription fees can not be empty!')
    .escape(), 
  studentTierController.createStudentTier as Application
);

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
  body('tierName')
    .notEmpty()
    .withMessage('Tier name can not be empty!')
    .escape(),
  body('monthlySubscriptionFees')
    .notEmpty()
    .withMessage('Monthly subscription fees can not be empty!')
    .escape(),  
  studentTierController.updateStudentTier as Application
);

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
router.delete('/:studentTierId', studentTierController.deleteStudentTier as Application);

export default router;
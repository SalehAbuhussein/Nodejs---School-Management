import { Application, Router } from 'express';

import { body } from 'express-validator';

import * as studentTierController from '../controllers/studentTier/studentTierController';

const router = Router();

/**
 * Get a list of student tiers
 * 
 * @route GET /studentTiers
 */
router.get('', studentTierController.getStudentTiers as Application);

/**
 * Get a single student tier
 * 
 * @route GET /studentTiers/:studentTierId
 */
router.get('/:studentTierId', studentTierController.getStudentTier as Application);

/**
 * Create student tier
 * 
 * @route GET /studentTiers/create
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
 * Update student tier
 * 
 * @route PATCH /studentTiers/:studentTierId
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
 * Delete student tier
 * 
 * @route DELETE /studentTiers/:studentTierId
 */
router.delete('/:studentTierId', studentTierController.deleteStudentTier as Application);

export default router;
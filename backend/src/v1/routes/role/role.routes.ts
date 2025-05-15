  import { Application, Router } from 'express';
import { body, param } from 'express-validator';

import * as roleController from 'src/v1/controllers/role/roleController';

import { handleValidation } from 'src/shared/middlewares/validators.middleware';

import mongoose from 'mongoose';

const router = Router();

/**
 * @openapi
 * /roles/{roleId}:
 *   get:
 *     tags:
 *       - Role Controller
 *     summary: Get a Role
 *     parameters:
 *       - name: roleId
 *         in: path
 *         description: role ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role fetched successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.get('/:roleId', roleController.getRole as Application);

// prettier-ignore
/**
 * Create a role
 *
 * @route POST /roles
 */
router.post('/',
  body('roleName')
    .trim()
    .notEmpty()
    .withMessage('Role name can not be empty!'),
  body('permissions')
    .isArray({ min: 1 })
    .withMessage('Permissions can not be empty!')
    .customSanitizer((permissions: string[]) => [ ...new Set(permissions)])
    .custom((permissions: string[]) => permissions.every(id => mongoose.Types.ObjectId.isValid(id)))
    .withMessage('Invalid permissions!'),
  handleValidation as Application,
  roleController.createRole as Application,
);

// prettier-ignore
/**
 * Update a role
 *
 * @route PATCH /roles/:roleId
 */
router.patch('/:roleId',
  param('roleId')
    .trim()
    .notEmpty()
    .withMessage('role id can not be empty')
    .bail()
    .isMongoId()
    .withMessage('invalid role id'),
  body('roleName')
    .trim()
    .notEmpty()
    .withMessage('Role name can not be empty!'),
  body('permissions')
    .isArray({ min: 1 })
    .withMessage('Permissions can not be empty!')
    .customSanitizer((permissions) => [...(new Set(permissions))])
    .custom((permissions: string[]) => permissions.every(id => mongoose.Types.ObjectId.isValid(id)))
    .withMessage('Invalid permissions!'),
  handleValidation as Application,
  roleController.updateRole as Application
);

// prettier-ignore
/**
 * @openapi
 * /roles/{roleId}:
 *   delete:
 *     tags:
 *       - Role Controller
 *     summary: Delete a role
 *     parameters:
 *       - name: roleId
 *         in: path
 *         description: role ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role Deleted Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.delete('/:roleId',
  param('roleId')
    .trim()
    .notEmpty()
    .withMessage('role id can not be empty')
    .bail()
    .isMongoId()
    .withMessage('Invalid role id!'),
  handleValidation as Application,
  roleController.deleteRole as Application
);

export default router;

import { Application, Router } from 'express';

import { body } from 'express-validator';

import * as roleController from '../controllers/role/roleController';

const router = Router();

/**
 * @openapi
 * /roles:
 *   get:
 *     tags:
 *       - Role Controller
 *     summary: Get a list of Roles
 *     responses:
 *       200:
 *         description: Roles Fetched Successfully!
 *       500:
 *         description: Server error
 */
router.get('', roleController.getRoles as Application);

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

/**
 * Create a single role
 * 
 * @route POST /roles/create
 */
router.post('/create',
  body('roleName')
    .notEmpty()
    .withMessage('Role name can not be empty!')
    .escape(),
  body('permissions')
    .notEmpty()
    .withMessage('Permissions can not be empty!')
    .escape(),
  roleController.createRole as Application
);

/**
 * Update a single role
 * 
 * @router PATCH /roles/:roleId
 */
router.patch('/:roleId',
  body('roleName')
  .notEmpty()
  .withMessage('Role name can not be empty!')
  .escape(),
  body('permissions')
    .notEmpty()
    .withMessage('Permissions can not be empty!')
    .escape(),
  roleController.updateRole as Application
);

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
 *         description: Role Id
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
router.delete('/:roleId', roleController.deleteRole as Application);

export default router;
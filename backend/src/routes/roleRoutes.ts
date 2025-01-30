import { Application, Router } from 'express';
import { body } from 'express-validator';

import * as roleController from 'src/controllers/role/roleController';

import { handleValidation } from 'src/shared/controllers/controllerValidator';

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
 * Create a role
 * 
 * @route POST /roles/create
 */
router.post('/create',
  body('roleName')
    .trim()
    .isEmpty()
    .withMessage('Role name can not be empty!'),
  body('permissions')
    .trim()
    .isEmpty()
    .withMessage('Permissions can not be empty!'),
  handleValidation as Application,
  roleController.createRole as Application
);

/**
 * Update a role
 * 
 * @router PATCH /roles/:roleId
 */
router.patch('/:roleId',
  body('roleName')
    .trim()
  .isEmpty()
  .withMessage('Role name can not be empty!'),
  body('permissions')
    .trim()
    .isEmpty()
    .withMessage('Permissions can not be empty!'),
  handleValidation as Application,
  roleController.updateRole as Application
);

/**
 * Delete a role
 * 
 * @router PATCH /roles/:roleId
 */
router.delete('/:roleId', roleController.deleteRole as Application);

export default router;
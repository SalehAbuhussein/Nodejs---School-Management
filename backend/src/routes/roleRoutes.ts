import { Application, Router } from 'express';

import { body } from 'express-validator';

import * as roleController from '../controllers/role/roleController';

const router = Router();

/**
 * Get a list of Roles
 * 
 * @route GET /roles
 */
router.get('/roles', roleController.getRoles as Application);

/**
 * Get a single Role
 * 
 * @route GET /roles
 */
router.get('/roles/:roleId', roleController.getRole as Application);

/**
 * Create a single role
 * 
 * @route POST /roles/create
 */
router.post('/roles/create',
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
router.patch('/roles/:roleId',
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
 * Delete a single role
 * 
 * @router DELETE /roles/:roleId
 */
router.delete('/roles/:roleId', roleController.deleteRole as Application);

export default router;
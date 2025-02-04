import { Application, Router } from 'express';
import { body, param } from 'express-validator';

import * as roleController from 'src/controllers/role/roleController';

import { handleValidation } from 'src/middlewares/validatorsMiddleware';

import { isObjectId, isObjectIds, removeDuplicates } from 'src/validators';
import { checkPermissionsExist } from 'src/routes/permission/permissionValidator';
import { checkRoleExist } from 'src/routes/role/roleValidator';

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
    .notEmpty()
    .withMessage('Role name can not be empty!'),
  body('permissions')
    .isArray({ min: 1 })
    .withMessage('Permissions can not be empty!')
    .customSanitizer((value: string[]) => removeDuplicates<string>(value))
    .custom(isObjectIds)
    .bail()
    .custom(checkPermissionsExist),
  handleValidation as Application,
  roleController.createRole as Application,
);

/**
 * Update a role
 * 
 * @route POST /roles/create
 */
router.patch('/:roleId',
  param('roleId')
    .trim()
    .notEmpty()
    .withMessage('role id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(checkRoleExist),
  body('roleName')
    .trim()
    .notEmpty()
    .withMessage('Role name can not be empty!'),
  body('permissions')
    .isArray({ min: 1 })
    .withMessage('Permissions can not be empty!')
    .customSanitizer((value) => removeDuplicates<string>(value))
    .custom(isObjectIds)
    .bail()
    .custom(checkPermissionsExist),
  handleValidation as Application,
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
    .custom(isObjectId)
    .bail()
    .custom(checkRoleExist),
  handleValidation as Application,
  roleController.deleteRole as Application
);

export default router;
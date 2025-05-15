import { Application, Router } from 'express';

import { body, param } from 'express-validator';

import * as permissionController from 'src/v1/controllers/permission/permissionController';

import { handleValidation } from 'src/shared/middlewares/validators.middleware';

const router = Router();

// prettier-ignore
/**
 * @openapi
 * /permissions/{permissionId}:
 *   get:
 *     tags:
 *       - Permission Controller
 *     summary: Get a Permission
 *     parameters:
 *       - name: permissionId
 *         in: path
 *         description: Permission ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission fetched Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.get('/:permissionId',
  param('permissionId')
    .trim()
    .notEmpty()
    .withMessage('permission id can not be empty')
    .isMongoId()
    .withMessage('Invalid permission id'),
  permissionController.getPermission as Application
);

// prettier-ignore
/**
 * @openapi
 * /permissions:
 *   post:
 *     tags:
 *       - Student Controller
 *     summary: Create a permission
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
 *         description: Permission Created Successfully
 *       500:
 *         description: Server error
 */
router.post('/',
  body('name')
    .trim()
    .notEmpty()
    .withMessage('name can not be empty!'),
  handleValidation as Application,
  permissionController.createPermission as Application
);

// prettier-ignore
/**
 * @openapi
 * /permissions/{permissionId}:
 *   patch:
 *     tags:
 *       - Permission Controller
 *     summary: Update a Permission
 *     parameters:
 *       - name: permissionId
 *         in: path
 *         description: Permission ID
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
 *         description: Teacher Updated Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.patch('/:permissionId',
  param('permissionId')
    .trim()
    .notEmpty()
    .withMessage('permission id can not be empty')
    .isMongoId()
    .withMessage('Invalid permission id'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('name can not be empty!'),
  handleValidation as Application,
  permissionController.updatePermission as Application
);

// prettier-ignore
/**
 * @openapi
 * /permissions/{permissionId}:
 *   delete:
 *     tags:
 *       - Permission Controller
 *     summary: Delete a Permission
 *     parameters:
 *       - name: permissionId
 *         in: path
 *         description: Permission Id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission Deleted Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.delete('/:permissionId',
  param('permissionId')
    .trim()
    .notEmpty()
    .withMessage('permission id can not be empty')
    .isMongoId()
    .withMessage('Invalid permission id'),
  permissionController.deletePermission as Application
);

export default router;

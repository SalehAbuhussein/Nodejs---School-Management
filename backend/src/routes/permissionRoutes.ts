import { Application, Router } from 'express';

import { body } from 'express-validator';

import * as permissionController from 'src/controllers/permission/permissionController';

import { handleValidation } from 'src/shared/controllers/controllerValidator';

const router = Router();

/**
 * @openapi
 * /permissions:
 *   get:
 *     tags:
 *       - Permission Controller
 *     summary: Get a list of permissions
 *     responses:
 *       200:
 *         description: Students Fetched Successfully!
 *       500:
 *         description: Server Error
 */
router.get('', permissionController.getPermissions as Application);

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
router.get('/:permissionId', permissionController.getPermission as Application);

/**
 * @openapi
 * /permissions/create:
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
router.post('/create',
  body('name')
    .trim()
    .isEmpty()
    .withMessage('name can not be empty!'),
  handleValidation as Application,
  permissionController.createPermission as Application
);

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
  body('name')
    .trim()
    .isEmpty()
    .withMessage('name can not be empty!'),
  handleValidation as Application,
  permissionController.updatePermission as Application
);

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
router.delete('/:permissionId', permissionController.deletePermission as Application);

export default router;
import { Application, Router } from 'express';

import { body, param } from 'express-validator';

import { handleValidation } from 'src/shared/middlewares/validators.middleware';

import * as teacherController from 'src/v1/controllers/teacher/teacherController';

import * as SubjectService from 'src/v1/services/subjectService';
import * as TeacherService from 'src/v1/services/teacherService';
import * as UserService from 'src/v1/services/userService';

import { isObjectId, isObjectIds } from 'src/shared/validators';

const router = Router();

// prettier-ignore
/**
 * @openapi
 * /teachers/{teacherId}:
 *   get:
 *     tags:
 *       - Teacher Controller
 *     summary: Get a single Teacher
 *     parameters:
 *       - name: teacherId
 *         in: path
 *         description: The teacher ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher Fetched Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server Error
 */
router.get('/:teacherId',
  param('teacherId')
    .trim()
    .notEmpty()
    .withMessage('teacher id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(TeacherService.checkTeacherExists),
  handleValidation as Application, 
  teacherController.getTeacher as Application
);

// prettier-ignore
/**
 * @openapi
 * /users:
 *   post:
 *     tags:
 *       - Teacher Controller
 *     summary: Create a new Teacher
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - secondName
 *               - thirdName
 *               - lastName
 *               - userId
 *             properties:
 *               firstName:
 *                 type: string
 *                 default: johndoe
 *               secondName:
 *                 type: string
 *                 default: secondName
 *               thirdName:
 *                 type: string
 *                 default: thirdName
 *               lastName:
 *                 type: string
 *                 default: lastName
 *               userId:
 *                 type: string
 *                 default: asd45646
 *     responses:
 *       201:
 *         description: Teacher Created Successfully
 *       500:
 *         description: Server error
 */
router.post('/',
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name can not be empty!'),
  body('secondName')
    .trim()
    .notEmpty()
    .withMessage('Second name can not be empty!'),
  body('thirdName')
    .trim()
    .notEmpty()
    .withMessage('Second name can not be empty!'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name can not be empty!'),
  body('userId')
    .trim()
    .notEmpty()
    .withMessage('User id can not be empty!')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(UserService.checkUserExists),
  handleValidation as Application,
  teacherController.createTeacher as Application
);

// prettier-ignore
/**
 * @openapi
 * /teachers/{teacherId}:
 *   patch:
 *     tags:
 *       - Teacher Controller
 *     summary: Update a Teacher
 *     parameters:
 *       - name: teacherId
 *         in: path
 *         description: The Teacher ID
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
 *               - firstName
 *               - secondName
 *               - thirdName
 *               - lastName
 *               - userId
 *             properties:
 *               firstName:
 *                 type: string
 *                 default: johndoe
 *               secondName:
 *                 type: string
 *                 default: secondName
 *               thirdName:
 *                 type: string
 *                 default: thirdName
 *               lastName:
 *                 type: string
 *                 default: lastName
 *               userId:
 *                 type: string
 *                 default: asd45646
 *     responses:
 *       200:
 *         description: Teacher Updated Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.patch('/:teacherId',
  param('teacherId')
    .trim()
    .notEmpty()
    .withMessage('teacher id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(TeacherService.checkTeacherExists),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name can not be empty!'),
  body('secondName')
    .trim()
    .notEmpty()
    .withMessage('Second name can not be empty!'),
  body('thirdName')
    .trim()
    .notEmpty()
    .withMessage('Second name can not be empty!'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name can not be empty!'),
  body('subjects')
    .optional()
    .isArray({ min: 1 })
    .withMessage('subjects must be array')
    .bail()
    .customSanitizer(subjects => [...(new Set(subjects))])
    .custom(isObjectIds)
    .bail()
    .custom(SubjectService.checkSubjectsExists),
  handleValidation as Application,
  teacherController.updateTeacher as Application
);

// prettier-ignore
/**
 * @openapi
 * /users/{teacherId}:
 *   delete:
 *     tags:
 *       - Teacher Controller
 *     summary: Delete a Teacher
 *     parameters:
 *       - name: teacherId
 *         in: path
 *         description: Teacher Id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher Deleted Successfully!
 *       404:
 *         description: Not Found!
 *       500:
 *         description: Server error
 */
router.delete('/:teacherId',
  param('teacherId')
    .trim()
    .notEmpty()
    .withMessage('teacher id can not be empty')
    .bail()
    .custom(isObjectId)
    .bail()
    .custom(TeacherService.checkTeacherExists),
  handleValidation as Application, 
  teacherController.deleteTeacher as Application
);

export default router;

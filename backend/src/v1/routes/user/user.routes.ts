import path from 'path';
import { Application, Router } from 'express';

import { body, cookie, param } from 'express-validator';
import multer from 'multer';

import * as userController from 'src/v1/controllers/user/userController';

import { handleValidation } from 'src/shared/middlewares/validators.middleware';
import { validateJwtToken } from 'src/shared/middlewares/validateJwtToken.middleware';

const router = Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// prettier-ignore
/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     tags:
 *       - User Controller
 *     summary: Get a single user
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: The user ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:userId',
  param('userId')
    .isMongoId()
    .withMessage('user id should be valid id'),
  handleValidation as Application,
  userController.getUser as Application
);

// prettier-ignore
/**
 * @openapi
 * /users:
 *   post:
 *     tags:
 *       - User Controller
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Server error
 */
router.post('/',
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty!'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email cannot be empty!')
    .isEmail()
    .withMessage('Email must be valid!'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password cannot be empty!'),
  body('role')
    .isMongoId()
    .withMessage('Role id must be valid id'),
  handleValidation as Application,
  upload.single('profileImg'),
  userController.createUser as Application
);

// prettier-ignore
/**
 * @openapi
 * /users/{userId}:
 *   patch:
 *     tags:
 *       - User Controller
 *     summary: Update a user
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: The user ID
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
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 default: johndoe
 *               email:
 *                 type: string
 *                 default: johndoe@mail.com
 *               password:
 *                 type: string
 *                 default: johndoe1234#
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch('/:userId',
  param('userId')
    .isMongoId()
    .withMessage('user id should be valid id'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty!'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email cannot be empty!')
    .isEmail()
    .withMessage('Email must be valid!'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password cannot be empty!'),
  body('role')
    .isMongoId()
    .withMessage('Role id must be valid id'),
  handleValidation as Application,
  upload.single('profileImg'),
  userController.updateUser as Application
);

// prettier-ignore
/**
 * @openapi
 * /users/{userId}:
 *   delete:
 *     tags:
 *       - User Controller
 *     summary: Delete a user by ID
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: The unique ID of the user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete('/:userId',
  param('userId')
    .isMongoId()
    .withMessage('user id should be valid id'),
  handleValidation as Application,
  userController.deleteUser as Application
);

// prettier-ignore
/**
 * @openapi
 * /login:
 *   post:
 *     tags:
 *       - Auth Controller
 *     summary: user login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successfull!
 *       401:
 *         description: Invalid username or password
 *       500:
 *         description: Server error
 */
router.post('/login',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email can not be empty!')
    .isEmail()
    .withMessage('Email is not valid Email!'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password can not be empty!'),
  handleValidation as Application,
  userController.postLogin,
);

// prettier-ignore
router.post('/user-info',
  validateJwtToken,
  userController.getUserInfo
);

router.post('/refresh-token',
  cookie('refreshToken')
    .trim()
    .notEmpty()
    .withMessage('Something went wrong'),
  handleValidation as Application,
  userController.refreshToken
);

export default router;

import path from 'path';
import { Application, Router } from 'express';

import { body } from 'express-validator';
import multer from 'multer';

import * as userController from 'src/controllers/user/userController';

import { verifyToken } from 'src/middlewares/verifyTokenMiddleware';

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

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - User Controller
 *     summary: Get a list of users
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       500:
 *         description: Server error
 */
router.get('', verifyToken, userController.getUsers as Application);

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
router.get('/:userId', userController.getUser as Application);

/**
 * @openapi
 * /users/create:
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
 *               - username
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 default: johndoe
 *               username:
 *                 type: string
 *                 default: johndoe123
 *               email:
 *                 type: string
 *                 default: johndoe@mail.com
 *               password:
 *                 type: string
 *                 default: johndoe1234#
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Server error
 */
router.post('/create',
  body('name').notEmpty().withMessage('Name cannot be empty!'),
  body('username').notEmpty().withMessage('Username cannot be empty!').escape(),
  body('email').notEmpty().withMessage('Email cannot be empty!').isEmail().withMessage('Email must be valid!').escape(),
  body('password').notEmpty().withMessage('Password cannot be empty!').escape(),
  upload.single('profileImg'),
  userController.createUser as Application
);

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
 *               - username
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 default: johndoe
 *               username:
 *                 type: string
 *                 default: johndoe123
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
  body('name').notEmpty().withMessage('Name cannot be empty!'),
  body('username').notEmpty().withMessage('Username cannot be empty!').escape(),
  body('email').notEmpty().withMessage('Email cannot be empty!').isEmail().withMessage('Email must be valid!').escape(),
  body('password').notEmpty().withMessage('Password cannot be empty!').escape(),
  upload.single('profileImg'),
  userController.updateUser as Application
);

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
router.delete('/:userId', userController.deleteUser as Application);

export default router;
import { Application, Router } from 'express';

import { body } from 'express-validator';

import { handleValidation } from 'src/middlewares/validatorsMiddleware';

import * as authController from 'src/controllers/auth/authController';

const router = Router();

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
  authController.postLogin,
);

export default router;
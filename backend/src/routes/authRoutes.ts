import { Router } from 'express';

import { body } from 'express-validator';

import * as authController from 'src/controllers/auth/authController';

const router = Router();

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
  authController.postLogin,
);

export default router;
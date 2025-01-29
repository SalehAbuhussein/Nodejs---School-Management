import { Router } from 'express';

import { body } from 'express-validator';

import * as authController from 'src/controllers/auth/authController';

const router = Router();

router.post('/login', 
  body('email')
    .notEmpty()
    .withMessage('Email can not be empty!')
    .escape(),
  body('password')
    .notEmpty()
    .withMessage('Password can not be empty!')
    .escape(),
  authController.postLogin,
);

export default router;
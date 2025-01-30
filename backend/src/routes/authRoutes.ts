import { Application, Router } from 'express';

import { body } from 'express-validator';

import * as authController from 'src/controllers/auth/authController';

import { handleValidation } from 'src/shared/controllers/controllerValidator';

const router = Router();

router.post('/login', 
  body('email')
    .trim()
    .isEmpty()
    .withMessage('Email can not be empty!')
    .isEmail()
    .withMessage('Email is not valid Email!'),
  body('password')
    .trim()
    .isEmpty()
    .withMessage('Password can not be empty!'),
  handleValidation as Application,
  authController.postLogin,
);

export default router;
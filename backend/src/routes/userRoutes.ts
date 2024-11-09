import { Router } from 'express';
import { body } from 'express-validator';

import * as userController from '../controllers/user/userController';
import { showSignupFieldsError, showLoginFieldsError } from '../controllers/user/validation';

const router = Router();

router.get('/signup', showSignupFieldsError, userController.getSignup);
router.get('/login', showLoginFieldsError, userController.getLogin);

router.post('/user/create', 
  body('username')
  .notEmpty()
  .withMessage('Username can not be empty!')
  .escape(),
  body('email')
  .notEmpty()
  .withMessage('Email can not be empty!')
  .isEmail()
  .withMessage('Email must be valid email!')
  .escape(),
  body('password')
  .notEmpty()
  .withMessage('Password must not be empty!')
  .escape(),
  userController.postUser
);

export default router;
import { Router } from 'express';

import { body } from 'express-validator';
import multer from 'multer';

import * as userController from '../controllers/user/userController';

const router = Router();

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' }); // Adjust the path as needed

router.get('/users', userController.getUsers);
router.post('/user/create',
  body('name')
    .notEmpty()
    .withMessage('Name can not be enoty!'),
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
  userController.createUser
);

export default router;
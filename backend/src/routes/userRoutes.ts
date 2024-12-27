import path from 'path';
import { Application, Router } from 'express';

import { body } from 'express-validator';
import multer from 'multer';

import * as userController from '../controllers/user/userController';

const router = Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  },
});
const upload = multer({ storage });

/**
 * Get a list of users
 * 
 * @route GET /users
 */
router.get('/users', userController.getUsers as Application);

/**
 * Get a single user
 * 
 * @route GET /users/:userId
 */
router.get('/users/:userId', userController.getUser as Application);

/**
 * Create a single user
 * 
 * @route POST /users/create
 */
router.post('/users/create',
  body('name')
    .notEmpty()
    .withMessage('Name can not be empty!'),
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
  // validateToken as (req: Request, res: Response, next: NextFunction) => Promise<void>,
  upload.single('profileImg'),
  userController.createUser as Application,
);

/**
 * Update a single user
 * 
 * @route PATCH /users/:userId
 */
router.patch('/users/:userId', 
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
  upload.single('profileImg'),
  userController.updateUser as Application,
);

router.delete('/users/:userId', userController.deleteUser as Application);

export default router;
import { Router } from 'express';

import * as authController from '../controllers/auth/authController';

const router = Router();

router.post('/login', authController.postLogin);

export default router;
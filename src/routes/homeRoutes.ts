import { Router } from 'express';

import * as homeController from '../controllers/home/homeController'

const router = Router();

router.get('/', homeController.getIndex);

export default router;
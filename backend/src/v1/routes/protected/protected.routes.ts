import { Router, Request, Response, NextFunction } from 'express';

import { validateJwtToken } from 'src/middlewares/validateJwtToken.middleware';

const router = Router();

router.get('/protected', validateJwtToken, (req: Request, res: Response<any>, next: NextFunction) => {
  res.status(200).json({ message: 'protected route' });
});

export default router;

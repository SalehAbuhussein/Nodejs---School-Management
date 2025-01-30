import { NextFunction, Request, Response } from 'express';

import { validationResult } from 'express-validator';

export const handleValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req).mapped();

  if (Object.keys(errors).length > 0) {
    const { msg } = Object.entries(errors)[0][1] as { path: string, msg: string };

    return res.status(422).json({
      status: 422,
      message: msg,
    });
  }

  next();
};
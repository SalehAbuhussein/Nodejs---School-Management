import { Request, Response, NextFunction } from 'express';

/**
 * Render landing page
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns { void }
 */
export const getIndex = (req: Request, res: Response, next: NextFunction): void => {
  res.render('index', {
    path: '/',
  });
};

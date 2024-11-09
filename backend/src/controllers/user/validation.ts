import { Request, Response, NextFunction } from 'express';

import { validationResult } from "express-validator";

/**
 * Show validation error if fields are not valid
 * When user tries to submit signup form
 * 
 * @param { Request } req 
 * @param { Response } res 
 * @param { NextFunction } next 
 * @returns { void }
 */
export const showSignupFieldsError = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req).array();

    if (errors.length > 0) {
      req.flash('error', errors[0].msg);
  
      return res.redirect('/signup');
    }

    next();
};

/**
 * Show validation error if fields are not valid
 * When user tries to submit login form
 * 
 * @param { Request } req 
 * @param { Response } res 
 * @param { NextFunction } next 
 * @returns { void }
 */
export const showLoginFieldsError = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req).array();

  if (errors.length > 0) {
    req.flash('error', errors[0].msg);

    return res.redirect('/signup');
  }

  next();
}
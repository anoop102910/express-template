import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { HTTP_STATUS } from '../utils/httpStatus';
import { CodeEnum } from '../utils/CodeEnum';

export const validate = (schema: AnyZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: 'Validation failed',
        errors: (error as ZodError).errors,
        code: CodeEnum.VALIDATION_FAILED
      });
    }
  }; 
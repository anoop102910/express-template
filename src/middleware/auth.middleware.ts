import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../utils/httpStatus';
import { UserDao } from '../authModule/user.dao';
import { config } from '../config';

interface JwtPayload {
  userId: string;
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: 'error',
        message: 'No token provided',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      config.jwt.accessTokenSecret
    ) as JwtPayload;

    // Get user from token
    const userDao = new UserDao();
    const user = await userDao.findById(decoded.userId);

    if (!user) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      status: 'error',
      message: 'Invalid token',
    });
  }
};

export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(
      token,
      config.jwt.accessTokenSecret
    ) as JwtPayload;

    const userDao = new UserDao();
    const user = await userDao.findById(decoded.userId);
    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    // Continue without setting user
    next();
  }
}; 
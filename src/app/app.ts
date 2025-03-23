import express from 'express';
import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from '../config';
import { HTTP_STATUS } from '../utils/httpStatus';
import authRoutes from '../authModule/auth.routes';
import { ApiError } from '../utils/ApiError';
import postRoutes from '../postModule/post.routes';
import { logger } from '../utils/logger';
const app = express();


app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Basic route
app.get('/', (_req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({
    status: 'ok',
  });
});

app.use(((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      code: err.code,
    });
  }
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: err.message || 'Something went wrong!',
    code: 'INTERNAL_SERVER_ERROR',
  });
}) as ErrorRequestHandler);


export default app;
import { NextFunction, Request, Response } from 'express';
import { env } from '../../config/config.service';

export interface IError extends Error {
  statusCode?: number;
  cause?: unknown;
}

export class ApplicationsExceptions extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    options?: ErrorOptions
  ) {
    super(message, options);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestException extends ApplicationsExceptions {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 400, options);
  }
}

export class UnauthorizedException extends ApplicationsExceptions {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 401, options);
  }
}

export class ForbiddenException extends ApplicationsExceptions {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 403, options);
  }
}

export class NotFoundException extends ApplicationsExceptions {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 404, options);
  }
}

export class ConflictException extends ApplicationsExceptions {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 409, options);
  }
}

export class TooManyRequestsException extends ApplicationsExceptions {
  constructor(message: string, options?: ErrorOptions) {
    super(message, 429, options);
  }
}

export const globalErrorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const isDev = env.MODE === 'DEVELOPMENT';

  if (statusCode >= 500) {
    console.error('Internal Server Error:', err);
  }

  res.status(statusCode).json({
    name: err.name,
    statusCode,
    message: err.message,
    stack: isDev ? err.stack : undefined,
    cause: statusCode < 500 ? err.cause : undefined
  });
};

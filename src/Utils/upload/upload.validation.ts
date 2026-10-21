import { Request, Response, NextFunction } from 'express';
import { BadRequestException } from '../res/error.response';

export const validateImageFile = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.file) {
    throw new BadRequestException('Image file is required');
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    throw new BadRequestException('Only JPEG, PNG and WebP images are allowed');
  }

  next();
};

export const validateOptionalImageFile = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Image is optional during update
  if (!req.file) {
    next();
    return;
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    throw new BadRequestException('Only JPEG, PNG and WebP images are allowed');
  }

  next();
};

export const validatePDFFile = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.file) {
    throw new BadRequestException('PDF file is required');
  }

  if (req.file.mimetype !== 'application/pdf') {
    throw new BadRequestException('Only PDF files are allowed');
  }

  next();
};

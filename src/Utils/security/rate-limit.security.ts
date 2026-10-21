import rateLimit from 'express-rate-limit';

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,

  message: {
    statusCode: 429,
    message: 'Too many login attempts. Please try again later.'
  },

  standardHeaders: 'draft-7',
  legacyHeaders: false
});

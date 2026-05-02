import rateLimit from 'express-rate-limit';

/** General API rate limiter: 60 requests per minute per IP */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests', retryAfter: 60 },
});

/** Stricter TTS rate limiter: 10 requests per minute per IP */
export const ttsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many TTS requests', retryAfter: 60 },
});

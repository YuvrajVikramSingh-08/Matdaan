import { body, validationResult } from 'express-validator';
import { JSDOM } from 'jsdom';
import type { Request, Response, NextFunction } from 'express';

// Server-side DOMPurify
let purify: any;
try {
  const createDOMPurify = require('dompurify');
  const window = new JSDOM('').window;
  purify = createDOMPurify(window as any);
} catch {
  purify = { sanitize: (v: string) => v.replace(/<[^>]*>/g, '') };
}

/** Chat message validators */
export const chatValidators = [
  body('message').trim().isLength({ min: 1, max: 500 })
    .withMessage('Message must be 1-500 characters')
    .customSanitizer((v: string) => purify.sanitize(v)),
  body('language').isIn(['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'pa', 'kn', 'ml', 'or'])
    .withMessage('Invalid language code'),
  body('sessionId').isString().isLength({ min: 1, max: 100 })
    .withMessage('Invalid session ID'),
];

/** Translation validators */
export const translateValidators = [
  body('text').trim().isLength({ min: 1, max: 2000 }).withMessage('Text must be 1-2000 characters'),
  body('targetLang').isIn(['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'pa', 'kn', 'ml', 'or']),
];

/** TTS validators */
export const ttsValidators = [
  body('text').trim().isLength({ min: 1, max: 500 }).withMessage('Text must be 1-500 characters'),
  body('language').isIn(['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'pa', 'kn', 'ml', 'or']),
];

/** Validation error handler middleware */
export function handleValidationErrors(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: errors.array() });
  }
  next();
}

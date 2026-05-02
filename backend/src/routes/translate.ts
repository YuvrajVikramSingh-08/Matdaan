import { Router, Request, Response } from 'express';
import { translateValidators, handleValidationErrors } from '../middleware/sanitize';
import { translateText } from '../services/translateService';

export const translateRouter = Router();

translateRouter.post('/', translateValidators, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { text, targetLang } = req.body;
    const result = await translateText(text, targetLang);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Translation failed', code: 500 });
  }
});

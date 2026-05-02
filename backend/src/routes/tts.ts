import { Router, Request, Response } from 'express';
import { ttsValidators, handleValidationErrors } from '../middleware/sanitize';
import { textToSpeech } from '../services/ttsService';

export const ttsRouter = Router();

ttsRouter.post('/', ttsValidators, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { text, language } = req.body;
    const audioContent = await textToSpeech(text, language);
    return res.json({ audioContent });
  } catch (err) {
    return res.status(500).json({ error: 'TTS failed', code: 500 });
  }
});

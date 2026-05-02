import { Router, Request, Response } from 'express';
import { chatValidators, handleValidationErrors } from '../middleware/sanitize';
import { verifyAuth } from '../middleware/auth';
import { detectIntent } from '../services/dialogflow';
import { generateResponse } from '../services/vertexai';
import { logger } from '../utils/logger';

export const chatRouter = Router();

chatRouter.post('/', chatValidators, handleValidationErrors, verifyAuth, async (req: Request, res: Response) => {
  try {
    const { message, language, sessionId } = req.body;
    logger.info('Chat request', { message: message.substring(0, 50), language, sessionId });

    // 1. Try Dialogflow CX first
    const dfResult = await detectIntent(message, sessionId, language);
    if (dfResult && dfResult.confidence > 0.7 && dfResult.intent !== 'Default Fallback Intent' && dfResult.response) {
      return res.json({ reply: dfResult.response, source: 'dialogflow' });
    }

    // 2. Fallback to Vertex AI (Gemini)
    const reply = await generateResponse(message, language);
    return res.json({ reply, source: 'vertex' });
  } catch (err) {
    logger.error('Chat route error', { error: (err as Error).message });
    return res.status(500).json({ error: 'Failed to process chat', code: 500 });
  }
});

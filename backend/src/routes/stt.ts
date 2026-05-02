import { Router } from 'express';
import { speechToText } from '../services/sttService';

export const sttRouter = Router();

sttRouter.post('/', async (req, res) => {
  try {
    const { audio, language } = req.body;
    if (!audio) return res.status(400).json({ error: 'Audio data required' });
    const transcript = await speechToText(audio, language || 'en');
    return res.json({ transcript });
  } catch (err) {
    return res.status(500).json({ error: 'STT failed', code: 500 });
  }
});

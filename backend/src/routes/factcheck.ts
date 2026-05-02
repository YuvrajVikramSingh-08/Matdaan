import { Router } from 'express';
import { generateResponse } from '../services/vertexai';
import { logger } from '../utils/logger';

export const factCheckRouter = Router();

factCheckRouter.post('/', async (req, res) => {
  try {
    const { claim, language } = req.body;
    if (!claim || claim.length > 1000) {
      return res.status(400).json({ error: 'Claim must be 1-1000 characters' });
    }

    const prompt = `You are a fact-checker for Indian election claims. Analyze the following claim and respond in JSON format:
{"verdict": "true|false|misleading|unverified", "explanation": "detailed explanation", "sources": ["url1", "url2"]}

Only use these verdicts:
- "true" if the claim is factually correct per ECI/official sources
- "false" if the claim is factually incorrect
- "misleading" if the claim is partially true but presented in a misleading way
- "unverified" if the claim cannot be verified from official sources

Claim to fact-check: "${claim}"

Respond ONLY with the JSON object, nothing else.`;

    const response = await generateResponse(prompt, language || 'en');

    try {
      const parsed = JSON.parse(response);
      return res.json(parsed);
    } catch {
      return res.json({
        verdict: 'unverified',
        explanation: response || 'This claim could not be verified against official ECI sources.',
        sources: ['https://eci.gov.in', 'https://pib.gov.in/factcheck'],
      });
    }
  } catch (err) {
    logger.error('Fact check error', { error: (err as Error).message });
    return res.json({
      verdict: 'unverified',
      explanation: 'Unable to verify this claim at the moment. Please check official ECI sources.',
      sources: ['https://eci.gov.in'],
    });
  }
});

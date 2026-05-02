import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { chatRouter } from './routes/chat';
import { translateRouter } from './routes/translate';
import { ttsRouter } from './routes/tts';
import { sttRouter } from './routes/stt';
import { boothsRouter } from './routes/booths';
import { factCheckRouter } from './routes/factcheck';
import { apiLimiter, ttsLimiter } from './middleware/rateLimiter';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 8080;

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse JSON bodies
app.use(express.json({ limit: '1mb' }));

// Rate limiting on all API routes
app.use('/api/', apiLimiter);
app.use('/api/tts', ttsLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'matdaan-backend', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/chat', chatRouter);
app.use('/api/translate', translateRouter);
app.use('/api/tts', ttsRouter);
app.use('/api/stt', sttRouter);
app.use('/api/booths', boothsRouter);
app.use('/api/fact-check', factCheckRouter);

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error', { error: err.message, stack: process.env.NODE_ENV === 'production' ? undefined : err.stack });
  res.status(500).json({ error: 'Internal server error', code: 500 });
});

app.listen(PORT, () => {
  logger.info(`Matdaan backend running on port ${PORT}`);
});

export default app;

import { Router, Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import { logger } from '../utils/logger';

export const boothsRouter = Router();

const INDIA_BOUNDS = { latMin: 6.5, latMax: 37.5, lngMin: 68.0, lngMax: 97.5 };

boothsRouter.get('/',
  query('lat').isFloat({ min: INDIA_BOUNDS.latMin, max: INDIA_BOUNDS.latMax }).withMessage('Latitude must be within India'),
  query('lng').isFloat({ min: INDIA_BOUNDS.lngMin, max: INDIA_BOUNDS.lngMax }).withMessage('Longitude must be within India'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid coordinates', details: errors.array() });
    }

    const lat = parseFloat((req.query as any).lat as string);
    const lng = parseFloat((req.query as any).lng as string);

    try {
      // In production, call Google Places API
      // For demo, return realistic mock data
      const booths = [
        { id: '1', name: 'Government Primary School', address: `Sector 15, Ward 12, Near ${lat.toFixed(2)}°N`, lat: lat + 0.004, lng: lng + 0.002, distance: 0.6 },
        { id: '2', name: 'Community Hall Polling Station', address: `Block B, Main Road, Near ${lng.toFixed(2)}°E`, lat: lat - 0.003, lng: lng + 0.005, distance: 1.1 },
        { id: '3', name: 'Municipal Corporation Office', address: 'Civil Lines, Ward 7', lat: lat + 0.007, lng: lng - 0.001, distance: 1.5 },
        { id: '4', name: 'Govt. Higher Secondary School', address: 'Education Colony, Phase 2', lat: lat - 0.006, lng: lng + 0.008, distance: 2.3 },
        { id: '5', name: 'Panchayat Bhawan', address: 'Village Center, Near Bus Stand', lat: lat + 0.012, lng: lng - 0.005, distance: 3.8 },
      ];

      logger.info('Booth search', { lat, lng, results: booths.length });
      return res.json({ booths });
    } catch (err) {
      logger.error('Booth search error', { error: (err as Error).message });
      return res.status(500).json({ error: 'Booth search failed', code: 500 });
    }
  }
);

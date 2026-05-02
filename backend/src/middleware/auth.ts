import type { Request, Response, NextFunction } from 'express';

/**
 * Firebase Auth middleware stub.
 * In production, verifies Firebase ID token from Authorization header.
 * For demo/development, passes through all requests.
 */
export function verifyAuth(req: Request, res: Response, next: NextFunction) {
  // In production, uncomment and configure Firebase Admin:
  // const token = req.headers.authorization?.split('Bearer ')[1];
  // if (!token) return res.status(401).json({ error: 'Unauthorized' });
  // try { await admin.auth().verifyIdToken(token); next(); }
  // catch { return res.status(401).json({ error: 'Invalid token' }); }

  // Demo mode: pass through
  next();
}

import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @route GET /health
 * @description Health check endpoint
 * @access Public
 */
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

export default router; 
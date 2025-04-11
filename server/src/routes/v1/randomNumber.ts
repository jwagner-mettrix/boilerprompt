import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @route   GET /api/v1/random-number
 * @desc    Generates a random integer between 1 and 100
 * @access  Public
 */
router.get('/', (req: Request, res: Response) => {
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  // const randomNumber = 14;
  res.json({ randomNumber });
});

export default router; 
import { Router } from 'express';
import healthRoutes from './health';
import v1Routes from './v1'; // Import the v1 router

const router = Router();

// Mount health check routes
router.use('/', healthRoutes);

// Mount all v1 routes under /api/v1 (relative to the /api mount point in app.ts)
router.use('/v1', v1Routes);

export default router;

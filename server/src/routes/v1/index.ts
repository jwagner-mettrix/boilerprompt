import { Router } from 'express';
import randomNumberRouter from './randomNumber'; // Import the new router

// Import specific v1 route handlers here (e.g., userRoutes, productRoutes)
// import userRoutes from './users'; // Example

const router = Router();

// Mount the random number route
router.use('/random-number', randomNumberRouter);

// Mount other specific v1 routes
// router.use('/users', userRoutes); // Example

// Placeholder route for v1
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to API v1' });
});

export default router; 
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controllers';

const router = Router();

// Google OAuth authentication
router.post('/google', AuthController.googleAuth);

// Get current user (protected route)
router.get('/me', AuthController.verifyToken, AuthController.getCurrentUser);

// Sign out
router.post('/signout', AuthController.verifyToken, AuthController.signOut);

export default router;

import { Router } from 'express';
import { authenticateToken } from '../../middleware/authMiddleware';
import * as authController from './auth.controller';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/profile', authenticateToken, authController.getProfile);

export default router;

import express from 'express';
import { deleteUserById, login, signup, verifySession } from '../controllers/userController.js';
import { validateSignup } from '../middleware/signupMiddleware.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authorizeAdmin } from '../middleware/authorizationMiddleware.js';

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', login);
router.get('/verify-session', authenticateToken, verifySession)
router.delete('/user/:id', authenticateToken, authorizeAdmin, deleteUserById);


export default router;

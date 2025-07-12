import express from 'express';

import { authenticateToken } from '../middleware/authMiddleware.js';
import { getMedicamente } from '../controllers/medicamenteController.js';

const router = express.Router();
router.get('/', authenticateToken, getMedicamente)


export default router;

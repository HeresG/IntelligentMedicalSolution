import express from 'express';

import { authenticateToken } from '../middleware/authMiddleware.js';
import { createMedicamentatie, getMedicamentatie } from '../controllers/medicamentatieController.js';

const router = express.Router();
router.post('/', authenticateToken, createMedicamentatie)
router.get('/:userId', authenticateToken, getMedicamentatie)


export default router;

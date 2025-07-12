import express from 'express';

import { authenticateToken } from '../middleware/authMiddleware.js';
import { getFileById } from '../controllers/fileController.js';

const router = express.Router();
router.get('/:id', authenticateToken, getFileById);


export default router;

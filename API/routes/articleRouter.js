import express from 'express';

import { authenticateToken } from '../middleware/authMiddleware.js';
import { getAllNameAndDescription, getByName } from '../controllers/articleController.js';

const router = express.Router();
router.get('/boli', authenticateToken, getAllNameAndDescription)
router.get('/:name', authenticateToken, getByName)


export default router;

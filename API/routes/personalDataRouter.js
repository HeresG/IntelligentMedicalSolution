import express from 'express';
import { getAllClients, getAllUsers, getClientById, getPersonalData, getPersonalDataById, personalDataSetup, savePersonalDataById } from '../controllers/personalDataController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validatePersonalDataSetup } from '../middleware/personalDataMiddleware.js';
import { authorizeAdmin, authorizeAdminOrDoctor, authorizeUserOrAdmin } from '../middleware/authorizationMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getPersonalData)
router.get('/user/:userId', authenticateToken, getPersonalDataById)
router.put('/user/:userId', authenticateToken, authorizeUserOrAdmin, savePersonalDataById)
router.post('/', authenticateToken,  validatePersonalDataSetup, personalDataSetup);
router.get('/clients', authenticateToken, authorizeAdminOrDoctor, getAllClients)
router.get('/clients/:userId', authenticateToken, getClientById)
router.get('/users', authenticateToken,authorizeAdmin, getAllUsers)

export default router;
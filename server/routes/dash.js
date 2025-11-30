import express from 'express';
import { getEmployeeStats, getManagerStats } from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/employee', protect, getEmployeeStats);
router.get('/manager', protect, authorize('manager'), getManagerStats);

export default router;

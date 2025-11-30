import express from 'express';
import { checkIn, checkOut, getMyHistory, getTodayStatus, getAllAttendance } from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/my-history', protect, getMyHistory);
router.get('/today', protect, getTodayStatus);
router.get('/all', protect, authorize('manager'), getAllAttendance);

export default router;
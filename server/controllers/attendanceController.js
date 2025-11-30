import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import { startOfDay, endOfDay, differenceInHours } from 'date-fns';

// @desc    Check in
// @route   POST /api/attendance/checkin
// @access  Private (Employee)
export const checkIn = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        const start = startOfDay(today);
        const end = endOfDay(today);

        // Check if already checked in
        const existingAttendance = await Attendance.findOne({
            userId,
            date: { $gte: start, $lte: end }
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Already checked in today' });
        }

        // Determine status (simple logic: late if after 10 AM)
        let status = 'present';
        if (today.getHours() >= 10) {
            status = 'late';
        }

        const attendance = await Attendance.create({
            userId,
            date: today,
            checkInTime: today,
            status
        });

        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check out
// @route   POST /api/attendance/checkout
// @access  Private (Employee)
export const checkOut = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        const start = startOfDay(today);
        const end = endOfDay(today);

        const attendance = await Attendance.findOne({
            userId,
            date: { $gte: start, $lte: end }
        });

        if (!attendance) {
            return res.status(400).json({ message: 'You have not checked in today' });
        }

        if (attendance.checkOutTime) {
            return res.status(400).json({ message: 'Already checked out today' });
        }

        attendance.checkOutTime = today;

        // Calculate total hours
        const hours = (today - attendance.checkInTime) / 1000 / 60 / 60;
        attendance.totalHours = hours.toFixed(2);

        // Update status if half day (e.g., less than 4 hours)
        if (hours < 4) {
            attendance.status = 'half-day';
        }

        await attendance.save();

        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my attendance history
// @route   GET /api/attendance/my-history
// @access  Private
export const getMyHistory = async (req, res) => {
    try {
        const attendance = await Attendance.find({ userId: req.user.id }).sort({ date: -1 });
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get today's status
// @route   GET /api/attendance/today
// @access  Private
export const getTodayStatus = async (req, res) => {
    try {
        const today = new Date();
        const start = startOfDay(today);
        const end = endOfDay(today);

        const attendance = await Attendance.findOne({
            userId: req.user.id,
            date: { $gte: start, $lte: end }
        });

        res.status(200).json(attendance || null);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all attendance (Manager)
// @route   GET /api/attendance/all
// @access  Private (Manager)
export const getAllAttendance = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};

        if (startDate && endDate) {
            query.date = {
                $gte: startOfDay(new Date(startDate)),
                $lte: endOfDay(new Date(endDate))
            };
        }

        const attendance = await Attendance.find(query)
            .populate('userId', 'name email employeeId department')
            .sort({ date: -1 });

        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

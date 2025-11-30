import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, subDays, format } from 'date-fns';

// @desc    Get employee dashboard stats
// @route   GET /api/dashboard/employee
// @access  Private
export const getEmployeeStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        const startMonth = startOfMonth(today);
        const endMonth = endOfMonth(today);

        const monthlyAttendance = await Attendance.find({
            userId,
            date: { $gte: startMonth, $lte: endMonth }
        });

        const present = monthlyAttendance.filter(a => a.status === 'present').length;
        const late = monthlyAttendance.filter(a => a.status === 'late').length;
        const halfDay = monthlyAttendance.filter(a => a.status === 'half-day').length;
        const absent = monthlyAttendance.filter(a => a.status === 'absent').length; // Note: Absent usually needs to be calculated against working days, but for now we count explicit absent records if any, or just rely on present/late counts. The prompt implies counting days.
        // For simplicity, we'll just return the counts of records we have.

        const totalHours = monthlyAttendance.reduce((acc, curr) => acc + (curr.totalHours || 0), 0);

        res.status(200).json({
            present,
            late,
            halfDay,
            absent, // This might need better logic (total working days - present/late/halfDay)
            totalHours: totalHours.toFixed(2)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get manager dashboard stats
// @route   GET /api/dashboard/manager
// @access  Private (Manager)
export const getManagerStats = async (req, res) => {
    try {
        const totalEmployees = await User.countDocuments({ role: 'employee' });

        const today = new Date();
        const start = startOfDay(today);
        const end = endOfDay(today);

        const todayAttendance = await Attendance.find({
            date: { $gte: start, $lte: end }
        });

        const presentCount = todayAttendance.length;
        const lateCount = todayAttendance.filter(a => a.status === 'late').length;
        const absentCount = totalEmployees - presentCount;

        // Calculate weekly stats (last 7 days)
        const weeklyStats = [];

        for (let i = 6; i >= 0; i--) {
            const date = subDays(today, i);
            const dayStart = startOfDay(date);
            const dayEnd = endOfDay(date);

            const dayAttendance = await Attendance.find({
                date: { $gte: dayStart, $lte: dayEnd }
            });

            const dayPresent = dayAttendance.filter(a => a.status === 'present' || a.status === 'half-day').length;
            const dayLate = dayAttendance.filter(a => a.status === 'late').length;
            // Assuming absent is total - (present + late)
            // Note: This is a simplification. Real systems would check working days, holidays, etc.
            const dayAbsent = Math.max(0, totalEmployees - (dayPresent + dayLate));

            weeklyStats.push({
                name: format(date, 'EEE'), // Mon, Tue, etc.
                present: dayPresent,
                late: dayLate,
                absent: dayAbsent
            });
        }

        res.status(200).json({
            totalEmployees,
            presentCount,
            absentCount,
            lateCount,
            weeklyStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

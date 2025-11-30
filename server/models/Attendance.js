import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    checkInTime: {
        type: Date
    },
    checkOutTime: {
        type: Date
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late', 'half-day'],
        default: 'absent'
    },
    totalHours: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Attendance', attendanceSchema);

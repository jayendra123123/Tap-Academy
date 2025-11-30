import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import attendanceRoutes from './routes/attandance.js';
import dashboardRoutes from './routes/dash.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

// Middleware
app.use(cors({
    origin: 'https://tap-academy-mu.vercel.app',
    credentials: true
}));
app.use(cookieParser());

// Database connection
connectDB();

app.get('/', (req, res) => {
    res.send('API is running');
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

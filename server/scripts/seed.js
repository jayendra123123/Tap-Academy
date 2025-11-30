import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/attendance_db';

const createUserIfMissing = async ({ name, email, password, role, employeeId, department }) => {
  // Prefer lookup by email first
  let user = await User.findOne({ email });
  if (user) {
    console.log(`User exists by email: ${email}`);
    return user;
  }
  // If email not found, check employeeId to avoid unique index conflicts
  user = await User.findOne({ employeeId });
  if (user) {
    console.log(`User exists by employeeId: ${employeeId} -> ${user.email}`);
    return user;
  }

  // Create new user
  user = new User({ name, email, password, role, employeeId, department });
  try {
    await user.save();
    console.log(`Created user: ${email} (${role})`);
    return user;
  } catch (err) {
    // Handle race/duplicate key errors by returning the existing document
    if (err && err.code === 11000) {
      console.warn('Duplicate key on user save, fetching existing user...');
      const existing = await User.findOne({ $or: [{ email }, { employeeId }] });
      if (existing) return existing;
    }
    throw err;
  }
};

const upsertAttendance = async (userId, date, checkInISO, checkOutISO, status) => {
  const existing = await Attendance.findOne({ userId, date });
  if (existing) {
    existing.checkInTime = existing.checkInTime || checkInISO;
    existing.checkOutTime = existing.checkOutTime || checkOutISO;
    existing.status = existing.status || status;
    if (existing.checkInTime && existing.checkOutTime && (!existing.totalHours || existing.totalHours === 0)) {
      const diff = (new Date(existing.checkOutTime) - new Date(existing.checkInTime)) / (1000 * 60 * 60);
      existing.totalHours = Math.round(diff * 100) / 100;
    }
    await existing.save();
    return existing;
  }
  const att = new Attendance({ userId, date, checkInTime: checkInISO, checkOutTime: checkOutISO, status, totalHours: 0 });
  if (checkInISO && checkOutISO) {
    const diff = (new Date(checkOutISO) - new Date(checkInISO)) / (1000 * 60 * 60);
    att.totalHours = Math.round(diff * 100) / 100;
  }
  await att.save();
  return att;
};

const run = async () => {
  await connectDB(MONGO_URI);

  const manager = await createUserIfMissing({ name: 'Admin Manager', email: 'manager@test.com', password: 'password', role: 'manager', employeeId: 'MGR001', department: 'HR' });
  const employee = await createUserIfMissing({ name: 'John Doe', email: 'employee@test.com', password: 'password', role: 'employee', employeeId: 'EMP001', department: 'Engineering' });

  // create attendance for last 14 days for employee
  const days = 14;
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dateStr = dateOnly.toISOString();
    const checkIn = new Date(dateOnly.getTime() + 9 * 60 * 60 * 1000).toISOString(); // 09:00
    const checkOut = new Date(dateOnly.getTime() + 17 * 60 * 60 * 1000).toISOString(); // 17:00
    const dayOfWeek = dateOnly.getDay();
    let status = 'present';
    if (dayOfWeek === 0 || dayOfWeek === 6) status = 'absent';
    await upsertAttendance(employee._id, dateOnly, status === 'present' ? checkIn : null, status === 'present' ? checkOut : null, status);
  }

  // add some attendance for manager
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const checkIn = new Date(dateOnly.getTime() + 8 * 60 * 60 * 1000).toISOString(); // 08:00
    const checkOut = new Date(dateOnly.getTime() + 16 * 60 * 60 * 1000).toISOString(); // 16:00
    await upsertAttendance(manager._id, dateOnly, checkIn, checkOut, 'present');
  }

  console.log('Seeding complete');
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });

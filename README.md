# Attendance Management System

A full-stack attendance management system with React frontend and Node.js/Express/MongoDB backend.

## Features

### Employee Features

- Secure authentication (login/register)
- Daily check-in/check-out functionality
- Personal attendance history with calendar view
- Monthly statistics dashboard
- Profile management

### Manager Features

- All employee features plus:
- View all employee attendance records
- Team overview dashboard with weekly stats
- Export attendance reports to CSV
- Advanced filtering and reporting tools

## Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- Git

## Quick Start

### 1. Clone & Install

```bash
git clone <repository-url>
cd Attendance

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../my_app
npm install
```

### 4. Start Application

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd my_app
npm start
```

## Business Logic

### Attendance Rules

- **Late**: Check-in after 10:00 AM
- **Half-day**: Less than 4 hours worked
- **Present**: Normal working hours
- **Absent**: No check-in recorded

### Role Permissions

- **Employee**: Own attendance only
- **Manager**: All employee data + reports

## Scripts

### Backend

- `npm start` - Production server
- `npm run dev` - Development with nodemon
- `npm run seed` - Initialize database with test data

### Frontend

- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests

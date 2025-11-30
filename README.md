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

## Technology Stack

**Frontend:** React.js, Tailwind CSS, Lucide React, Date-fns  
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs

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

### 2. Environment Setup

#### Backend (.env in server directory)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/attendance_db
JWT_SECRET=your-super-secret-jwt-key-here
```

#### Frontend (.env in my_app directory)

```env
REACT_APP_API_URL=http://localhost:5000
```

### 3. Initialize Database

```bash
cd server
npm run seed
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

### 5. Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Demo Accounts

**Manager**: manager@test.com / password  
**Employee**: employee@test.com / password

## Environment Variables

### Server (.env)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/attendance_db
JWT_SECRET=your-super-secret-jwt-key-here
```

### Client (.env)

```env
REACT_APP_API_URL=http://localhost:5000
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get profile

### Attendance

- `POST /api/attendance/checkin` - Daily check-in
- `POST /api/attendance/checkout` - Daily check-out
- `GET /api/attendance/my-history` - Personal history
- `GET /api/attendance/today` - Today's status
- `GET /api/attendance/all` - All records (Manager only)

### Dashboard

- `GET /api/dashboard/employee` - Employee stats
- `GET /api/dashboard/manager` - Manager stats

## Project Structure

```
Attendance/
├── server/              # Backend API
│   ├── config/         # Database config
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── scripts/        # DB seeding
│   └── index.js        # Server entry
├── my_app/             # Frontend React app
│   ├── src/component/  # React components
│   ├── public/         # Static files
│   └── package.json    # Dependencies
└── README.md           # This file
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

## Troubleshooting

### Common Issues

1. **MongoDB Connection**: Verify MONGO_URI and MongoDB service
2. **Port Conflicts**: Change PORT in .env or kill existing processes
3. **CORS Errors**: Check API URL configuration
4. **Auth Issues**: Clear browser localStorage

### Development Tips

- Check browser console for frontend errors
- Monitor server terminal for API errors
- Use MongoDB Compass for database inspection
- Verify environment variables are loaded correctly

## License

MIT License

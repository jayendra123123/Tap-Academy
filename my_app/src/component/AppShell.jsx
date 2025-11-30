import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, LogOut } from 'lucide-react';
import AttendanceIcon from './AttendanceIcon';
import TopToggleIcon from './TopToggleIcon';
import { LoginPage, RegisterPage } from './Auth';
import {
  EmployeeDashboard,
  ManagerDashboard
} from './Dashboards';
import { AttendanceHistory } from './AttendanceHistory';
import { AllEmployeesAttendance } from './AllEmployeesAttendance';
import { Profile } from './Profile';
import TeamCalendar from './TeamCalendar';
import ManagerReports from './ManagerReports';
const API_BASE = process.env.REACT_APP_API_URL || 'https://tap-academy-o1jz.onrender.com';

const apiRequest = async (path, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch (e) { data = { message: text || res.statusText }; }

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      try { window.dispatchEvent(new Event('auth:logout')); } catch (e) { }
    }
    const err = new Error(data.message || res.statusText || 'API error');
    err.status = res.status;
    throw err;
  }

  return data;
};

const api = {
  baseURL: API_BASE,
  login: (email, password) => apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data) => apiRequest('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  checkIn: () => apiRequest('/api/attendance/checkin', { method: 'POST' }),
  checkOut: () => apiRequest('/api/attendance/checkout', { method: 'POST' }),
  getMyHistory: () => apiRequest('/api/attendance/my-history'),
  getTodayStatus: () => apiRequest('/api/attendance/today'),
  getAllAttendance: (query = '') => apiRequest(`/api/attendance/all${query ? `?${query}` : ''}`),
  getManagerStats: () => apiRequest('/api/dashboard/manager'),
  getEmployeeStats: () => apiRequest('/api/dashboard/employee')
};
const useStore = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) { setUser(JSON.parse(savedUser)); setToken(savedToken); }
    const handleAuthLogout = () => { setUser(null); setToken(null); localStorage.removeItem('user'); localStorage.removeItem('token'); };
    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.login(email, password);
      const user = {
        _id: response._id,
        name: response.name,
        email: response.email,
        role: response.role,
        employeeId: response.employeeId,
        department: response.department
      };
      setUser(user);
      setToken(response.token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', response.token);
      return response;
    } finally { setLoading(false); }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const response = await api.register(data);
      const user = {
        _id: response._id,
        name: response.name,
        email: response.email,
        role: response.role,
        employeeId: response.employeeId,
        department: response.department
      };
      setUser(user);
      setToken(response.token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', response.token);
      return response;
    } finally { setLoading(false); }
  };

  const logout = () => { setUser(null); setToken(null); localStorage.removeItem('user'); localStorage.removeItem('token'); };

  return { user, token, loading, login, register, logout };
};

export default function AppShell() {
  const { user, loading, login, register, logout } = useStore();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showAuthPage, setShowAuthPage] = useState('login');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const employeeNavItems = [ { id: 'dashboard', label: 'Dashboard', icon: Calendar }, { id: 'attendance', label: 'My Attendance', icon: AttendanceIcon }, { id: 'profile', label: 'Profile', icon: Users } ];
  const managerNavItems = [ { id: 'dashboard', label: 'Dashboard', icon: Calendar }, { id: 'all-attendance', label: 'All Attendance', icon: Users }, { id: 'team-calendar', label: 'Team Calendar', icon: Calendar }, { id: 'reports', label: 'Reports', icon: Users }, { id: 'profile', label: 'Profile', icon: Users } ];
  const navItems = user?.role === 'manager' ? managerNavItems : employeeNavItems;

  if (!user) {
    if (showAuthPage === 'login') {
      return <LoginPage onLogin={login} onSwitchToRegister={() => setShowAuthPage('register')} />;
    }
    return <RegisterPage onRegister={register} onSwitchToLogin={() => setShowAuthPage('login')} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Clock className="text-white" size={24} />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">Attendance</h1>
                <p className="text-xs text-gray-600">{user.role === 'manager' ? 'Manager Portal' : 'Employee Portal'}</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="hidden lg:block">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-sm text-gray-600">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-600 truncate">{user.email}</p>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
              </div>

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <TopToggleIcon open={sidebarOpen} size={20} />
              </button>
            </div>
          </div>
        </div>

        {sidebarOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-2 space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'dashboard' && (user.role === 'manager' ? <ManagerDashboard api={api} /> : <EmployeeDashboard api={api} />)}
        {currentPage === 'attendance' && <AttendanceHistory api={api} />}
        {currentPage === 'all-attendance' && <AllEmployeesAttendance api={api} />}
        {currentPage === 'team-calendar' && <TeamCalendar api={api} />}
        {currentPage === 'reports' && <ManagerReports api={api} />}
        {currentPage === 'profile' && <Profile user={user} logout={logout} />}
      </div>
    </div>
  );
}

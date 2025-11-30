import React, { useState } from 'react';
import { Clock } from 'lucide-react';

export const LoginPage = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white border border-black rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-black w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-black">Attendance System</h1>
          <p className="text-black/70 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-white border border-black text-black p-3 rounded-lg text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-semibold text-black mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
              placeholder="employee@test.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
              placeholder="password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={onSwitchToRegister} className="text-black hover:underline text-sm">
            Don't have an account? Register
          </button>
        </div>

        <div className="mt-6 p-4 bg-white border border-black rounded-lg text-xs text-black/70">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p>Employee: employee@test.com / password</p>
          <p>Manager: manager@test.com / password</p>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employeeId: '',
    department: '',
    role: 'employee'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onRegister({ ...formData });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white border border-black rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-black">Create Account</h1>
          <p className="text-black/70 mt-2">Join us to manage your attendance</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-white border border-black text-black p-3 rounded-lg text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-semibold text-black mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">Employee ID</label>
            <input
              type="text"
              value={formData.employeeId}
              onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
              className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
              placeholder="EMP001"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
              required
            >
              <option value="">Select Dept</option>
              <option value="Engineering">Engineering</option>
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20"
              required
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={onSwitchToLogin} className="text-black hover:underline text-sm">Already have an account? Sign In</button>
        </div>
      </div>
    </div>
  );
};

export default {
  LoginPage,
  RegisterPage
};

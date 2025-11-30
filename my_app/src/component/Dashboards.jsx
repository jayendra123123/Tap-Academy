import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';

export const EmployeeDashboard = ({ api }) => {
  const [stats, setStats] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      setError(null);
      const dash = await api.getEmployeeStats();
      const status = await api.getTodayStatus();
      setStats(dash || {});
      setTodayStatus(status || {});
    } catch (err) {
      setError(err?.message || 'Failed to load dashboard');
      setStats({});
      setTodayStatus({});
    } finally { setLoading(false); }
  };

  const handleCheckIn = async () => { await api.checkIn(); loadData(); };
  const handleCheckOut = async () => { await api.checkOut(); loadData(); };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return (
    <div className="p-8 text-center">
      <div className="mb-4 text-red-600 font-semibold">{error}</div>
      <div className="flex items-center justify-center gap-3">
        <button onClick={loadData} className="px-4 py-2 bg-black text-white rounded">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-black uppercase tracking-wide">Employee Dashboard</h1>
        <div className="text-sm font-medium text-black/70">{new Date().toLocaleDateString()}</div>
      </header>

      <section className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white border border-black rounded-xl p-6 shadow-lg transform hover:scale-[1.015] transition-all">
          <h2 className="text-sm font-semibold text-black uppercase mb-3">Today's Status</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-black text-black">{todayStatus?.status || 'Not Checked In'}</p>
              {todayStatus?.checkInTime && (<p className="mt-2 text-sm text-black/80">Check In: {new Date(todayStatus.checkInTime).toLocaleTimeString()}</p>)}
              {todayStatus?.checkOutTime && (<p className="text-sm text-black/80">Check Out: {new Date(todayStatus.checkOutTime).toLocaleTimeString()}</p>)}
            </div>
            <div className="space-y-2">
              {!todayStatus?.checkInTime ? (
                <button onClick={handleCheckIn} className="bg-black text-white px-5 py-2 rounded-md font-semibold tracking-wide">Check In</button>
              ) : !todayStatus?.checkOutTime ? (
                <button onClick={handleCheckOut} className="bg-black text-white px-5 py-2 rounded-md font-semibold tracking-wide">Check Out</button>
              ) : (
                <div className="bg-black text-white px-5 py-2 rounded-md font-semibold">Completed</div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3 grid grid-cols-1 gap-6">
          <div className="bg-white border border-black rounded-xl p-5 shadow-md flex items-center justify-between gap-4 transform hover:-translate-y-1 transition-transform">
            <div>
              <p className="text-xs font-semibold text-black uppercase">Present (This Month)</p>
              <p className="text-2xl font-extrabold text-black">{stats?.present ?? '-'}</p>
            </div>
            <div className="p-3 rounded-full border border-black"><Calendar className="text-black" size={20} /></div>
          </div>

          <div className="bg-white border border-black rounded-xl p-5 shadow-md flex items-center justify-between gap-4 transform hover:-translate-y-1 transition-transform">
            <div>
              <p className="text-xs font-semibold text-black uppercase">Late (This Month)</p>
              <p className="text-2xl font-extrabold text-black">{stats?.late ?? '-'}</p>
            </div>
            <div className="p-3 rounded-full border border-black"><Clock className="text-black" size={20} /></div>
          </div>

          <div className="bg-white border border-black rounded-xl p-5 shadow-md flex items-center justify-between gap-4 transform hover:-translate-y-1 transition-transform">
            <div>
              <p className="text-xs font-semibold text-black uppercase">Total Hours</p>
              <p className="text-2xl font-extrabold text-black">{stats?.totalHours ?? '-'}</p>
            </div>
            <div className="p-3 rounded-full border border-black"><Users className="text-black" size={20} /></div>
          </div>
        </div>
      </section>

    </div>
  );
};

export const ManagerDashboard = ({ api }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const t = await api.getManagerStats();
      setStats(t);
    } finally { setLoading(false); }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-black uppercase tracking-wide">Manager Dashboard</h1>
        <div className="text-sm font-medium text-black/70">Team overview</div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-black rounded-xl p-6 shadow-lg transform hover:scale-[1.01] transition-all">
          <p className="text-xs font-semibold text-black uppercase">Total Employees</p>
          <p className="text-2xl font-extrabold text-black">{stats?.totalEmployees ?? 0}</p>
        </div>
        <div className="bg-white border border-black rounded-xl p-6 shadow-lg transform hover:scale-[1.01] transition-all">
          <p className="text-xs font-semibold text-black uppercase">Present Today</p>
          <p className="text-2xl font-extrabold text-black">{stats?.presentCount ?? 0}</p>
        </div>
        <div className="bg-white border border-black rounded-xl p-6 shadow-lg transform hover:scale-[1.01] transition-all">
          <p className="text-xs font-semibold text-black uppercase">Absent Today</p>
          <p className="text-2xl font-extrabold text-black">{stats?.absentCount ?? 0}</p>
        </div>
        <div className="bg-white border border-black rounded-xl p-6 shadow-lg transform hover:scale-[1.01] transition-all">
          <p className="text-xs font-semibold text-black uppercase">Late Today</p>
          <p className="text-2xl font-extrabold text-black">{stats?.lateCount ?? 0}</p>
        </div>
      </div>

      <div className="bg-white border border-black rounded-xl p-6 shadow-md">
        <h3 className="text-sm font-semibold text-black uppercase mb-4">Weekly Attendance Overview</h3>
        {stats?.weeklyStats && stats.weeklyStats.length > 0 ? (
          <div className="space-y-3">
            {stats.weeklyStats.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-black">{day.name}</span>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600">Present: {day.present}</span>
                  <span className="text-yellow-600">Late: {day.late}</span>
                  <span className="text-red-600">Absent: {day.absent}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No weekly data available</p>
        )}
      </div>
    </div>
  );
};

export default null;

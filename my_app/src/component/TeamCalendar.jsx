import React, { useEffect, useState } from 'react';

export const TeamCalendar = ({ api }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getManagerStats();
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Team Calendar View</h1>
        <div className="text-sm text-gray-600">Summary for team</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-3">Today's Snapshot</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded">Total Employees<br/><strong>{summary?.totalEmployees ?? '-'}</strong></div>
          <div className="p-4 border rounded">Present Today<br/><strong>{summary?.presentCount ?? '-'}</strong></div>
          <div className="p-4 border rounded">Absent Today<br/><strong>{summary?.absentCount ?? '-'}</strong></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-3">Weekly Overview</h3>
        {summary?.weeklyStats && summary.weeklyStats.length > 0 ? (
          <div className="space-y-2">
            {summary.weeklyStats.map((day, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">{day.name}</span>
                <div className="text-sm space-x-4">
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

export default TeamCalendar;

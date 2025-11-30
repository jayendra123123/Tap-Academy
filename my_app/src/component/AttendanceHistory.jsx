import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const AttendanceHistory = ({ api }) => {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const historyData = await api.getMyHistory();
      setHistory(historyData);
      
      const summary = {
        present: historyData.filter(h => h.status === 'present').length,
        absent: historyData.filter(h => h.status === 'absent').length,
        late: historyData.filter(h => h.status === 'late').length,
        halfDay: historyData.filter(h => h.status === 'half-day').length,
        totalHours: historyData.reduce((acc, h) => acc + (parseFloat(h.totalHours) || 0), 0).toFixed(2)
      };
      setSummary(summary);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const record = history.find(h => {
        const recordDate = new Date(h.date).toISOString().split('T')[0];
        return recordDate === dateStr;
      });
      days.push({ date: i, record });
    }
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Attendance History</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-green-50 rounded-lg p-4 text-center"><p className="text-green-600 text-sm font-medium">Present</p><p className="text-2xl font-bold text-green-700">{summary.present}</p></div>
        <div className="bg-red-50 rounded-lg p-4 text-center"><p className="text-red-600 text-sm font-medium">Absent</p><p className="text-2xl font-bold text-red-700">{summary.absent}</p></div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center"><p className="text-yellow-600 text-sm font-medium">Late</p><p className="text-2xl font-bold text-yellow-700">{summary.late}</p></div>
        <div className="bg-orange-50 rounded-lg p-4 text-center"><p className="text-orange-600 text-sm font-medium">Half Day</p><p className="text-2xl font-bold text-orange-700">{summary.halfDay}</p></div>
        <div className="bg-blue-50 rounded-lg p-4 text-center"><p className="text-blue-600 text-sm font-medium">Total Hours</p><p className="text-2xl font-bold text-blue-700">{summary.totalHours}</p></div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded"><ChevronLeft size={20} /></button>
          <h2 className="text-xl font-semibold">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded"><ChevronRight size={20} /></button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="text-center font-semibold text-gray-600 text-sm py-2">{d}</div>)}
          {days.map((day, idx) => (
            <div key={idx} className={`aspect-square flex items-center justify-center rounded-lg text-sm ${
              !day ? 'bg-transparent' :
              day.record?.status === 'present' ? 'bg-green-100 text-green-700 font-semibold' :
              day.record?.status === 'late' ? 'bg-yellow-100 text-yellow-700 font-semibold' :
              day.record?.status === 'absent' ? 'bg-red-100 text-red-700 font-semibold' :
              day.record?.status === 'half-day' ? 'bg-orange-100 text-orange-700 font-semibold' :
              'bg-gray-50 text-gray-400'
            }`}>{day?.date}</div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-100 rounded"></div><span>Present</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-100 rounded"></div><span>Absent</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-100 rounded"></div><span>Late</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-100 rounded"></div><span>Half Day</span></div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Detailed Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b"><th className="text-left py-3 px-4">Date</th><th className="text-left py-3 px-4">Check In</th><th className="text-left py-3 px-4">Check Out</th><th className="text-left py-3 px-4">Total Hours</th><th className="text-left py-3 px-4">Status</th></tr>
            </thead>
            <tbody>
              {history.slice(0,10).map(record => (
                <tr key={record._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}</td>
                  <td className="py-3 px-4">{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</td>
                  <td className="py-3 px-4">{record.totalHours || 0} hrs</td>
                  <td className="py-3 px-4"><span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    record.status === 'present' ? 'bg-green-100 text-green-700' :
                    record.status === 'late' ? 'bg-yellow-100 text-yellow-700' :
                    record.status === 'absent' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>{record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default {
  AttendanceHistory
};

import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export const ManagerReports = ({ api }) => {
  const [attendance, setAttendance] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ startDate: '', endDate: '' });

  useEffect(() => { loadData(); }, []);
  useEffect(() => { applyFilters(); }, [filters, attendance]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getAllAttendance();
      setAttendance(data);
      setFilteredData(data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const applyFilters = () => {
    let filtered = [...attendance];
    if (filters.startDate) {
      filtered = filtered.filter(a => new Date(a.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      filtered = filtered.filter(a => new Date(a.date) <= new Date(filters.endDate));
    }
    setFilteredData(filtered);
  };

  const exportToCSV = () => {
    const headers = ['Employee ID','Employee Name','Department','Date','Check In','Check Out','Total Hours','Status'];
    const rows = filteredData.map(a => [
      a.userId?.employeeId || '',
      a.userId?.name || '',
      a.userId?.department || '',
      new Date(a.date).toLocaleDateString(),
      a.checkInTime ? new Date(a.checkInTime).toLocaleString() : '',
      a.checkOutTime ? new Date(a.checkOutTime).toLocaleString() : '',
      a.totalHours || 0,
      a.status
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`; a.click();
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports</h1>
        <button onClick={exportToCSV} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Download size={18}/>Export CSV
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-3">Date Range Filter</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input 
              type="date" 
              value={filters.startDate} 
              onChange={(e) => setFilters({...filters, startDate: e.target.value})} 
              className="px-3 py-2 border rounded w-full" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input 
              type="date" 
              value={filters.endDate} 
              onChange={(e) => setFilters({...filters, endDate: e.target.value})} 
              className="px-3 py-2 border rounded w-full" 
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-3">Attendance Summary</h3>
        <p className="text-gray-600 mb-4">Showing {filteredData.length} records</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <p className="text-green-600 text-sm font-medium">Present</p>
            <p className="text-2xl font-bold text-green-700">
              {filteredData.filter(a => a.status === 'present').length}
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg text-center">
            <p className="text-yellow-600 text-sm font-medium">Late</p>
            <p className="text-2xl font-bold text-yellow-700">
              {filteredData.filter(a => a.status === 'late').length}
            </p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg text-center">
            <p className="text-red-600 text-sm font-medium">Absent</p>
            <p className="text-2xl font-bold text-red-700">
              {filteredData.filter(a => a.status === 'absent').length}
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg text-center">
            <p className="text-orange-600 text-sm font-medium">Half Day</p>
            <p className="text-2xl font-bold text-orange-700">
              {filteredData.filter(a => a.status === 'half-day').length}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Employee</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Check In</th>
                <th className="text-left py-3 px-4">Check Out</th>
                <th className="text-left py-3 px-4">Hours</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0,10).map(record => (
                <tr key={record._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{record.userId?.name || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{record.userId?.employeeId}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}</td>
                  <td className="py-3 px-4">{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</td>
                  <td className="py-3 px-4">{record.totalHours || 0} hrs</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      record.status === 'present' ? 'bg-green-100 text-green-700' :
                      record.status === 'late' ? 'bg-yellow-100 text-yellow-700' :
                      record.status === 'absent' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerReports;

import React, { useState, useEffect } from 'react';
import { Download, Filter } from 'lucide-react';

export const AllEmployeesAttendance = ({ api }) => {
  const [attendance, setAttendance] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ employee: '', date: '', status: '', department: '' });

  useEffect(() => { loadData(); }, []);
  useEffect(() => { applyFilters(); }, [filters, attendance]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getAllAttendance();    
      setAttendance(data);
      setFilteredData(data);
    } finally { setLoading(false); }
  };

  const applyFilters = () => {
    let filtered = [...attendance];
    if (filters.employee) {
      filtered = filtered.filter(a => 
        (a.userId?.name && a.userId.name.toLowerCase().includes(filters.employee.toLowerCase())) ||
        (a.userId?.employeeId && a.userId.employeeId.toLowerCase().includes(filters.employee.toLowerCase()))
      );
    }
    if (filters.date) {
      filtered = filtered.filter(a => {
        const recordDate = new Date(a.date).toISOString().split('T')[0];
        return recordDate === filters.date;
      });
    }
    if (filters.status) filtered = filtered.filter(a => a.status === filters.status);
    if (filters.department) filtered = filtered.filter(a => a.userId?.department === filters.department);
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">All Employees Attendance</h1>
        <button onClick={exportToCSV} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><Download size={20}/>Export CSV</button>
      </div>

      <div className="bg-white rounded-lg p-6 shadow">
        <div className="flex items-center gap-2 mb-4"><Filter size={20} className="text-gray-600" /><h3 className="text-lg font-semibold">Filters</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Search by name or ID" value={filters.employee} onChange={(e) => setFilters({...filters, employee: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="date" value={filters.date} onChange={(e) => setFilters({...filters, date: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg" />
          <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg"><option value="">All Status</option><option value="present">Present</option><option value="absent">Absent</option><option value="late">Late</option><option value="half-day">Half Day</option></select>
          <select value={filters.department} onChange={(e) => setFilters({...filters, department: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg"><option value="">All Departments</option><option value="Engineering">Engineering</option><option value="HR">HR</option><option value="Sales">Sales</option></select>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow">
        <p className="text-gray-600 mb-4">Showing {filteredData.length} records</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b"><th className="text-left py-3 px-4">Employee ID</th><th className="text-left py-3 px-4">Name</th><th className="text-left py-3 px-4">Department</th><th className="text-left py-3 px-4">Date</th><th className="text-left py-3 px-4">Check In</th><th className="text-left py-3 px-4">Check Out</th><th className="text-left py-3 px-4">Hours</th><th className="text-left py-3 px-4">Status</th></tr>
            </thead>
            <tbody>
              {filteredData.slice(0,20).map(record => (
                <tr key={record._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{record.userId?.employeeId || 'N/A'}</td>
                  <td className="py-3 px-4 font-medium">{record.userId?.name || 'N/A'}</td>
                  <td className="py-3 px-4">{record.userId?.department || 'N/A'}</td>
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
  AllEmployeesAttendance
};

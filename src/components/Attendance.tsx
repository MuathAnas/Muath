import { useState } from 'react';
import { Employee, AttendanceRecord } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  employees: Employee[];
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
}

export default function Attendance({ employees, attendance, setAttendance }: Props) {
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  const [filterDept, setFilterDept] = useState('all');
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [markForm, setMarkForm] = useState({ employeeId: '', status: 'present' as AttendanceRecord['status'], checkIn: '08:00', checkOut: '16:00', notes: '' });

  const dayAttendance = attendance.filter(a => a.date === selectedDate);
  const filteredEmployees = employees.filter(e => filterDept === 'all' || e.department === filterDept);

  const getAttendanceForEmployee = (empId: string) => {
    return dayAttendance.find(a => a.employeeId === empId);
  };

  const handleMarkAttendance = () => {
    const existing = attendance.find(a => a.employeeId === markForm.employeeId && a.date === selectedDate);
    if (existing) {
      setAttendance(attendance.map(a =>
        a.id === existing.id ? { ...a, status: markForm.status, checkIn: markForm.checkIn, checkOut: markForm.checkOut, notes: markForm.notes } : a
      ));
    } else {
      const newRecord: AttendanceRecord = {
        id: uuidv4(),
        employeeId: markForm.employeeId,
        date: selectedDate,
        checkIn: markForm.checkIn,
        checkOut: markForm.checkOut,
        status: markForm.status,
        notes: markForm.notes
      };
      setAttendance([...attendance, newRecord]);
    }
    setShowMarkModal(false);
  };

  const statusConfig = {
    present: { color: 'bg-green-100 text-green-700 border-green-300', icon: 'fa-check-circle', iconColor: 'text-green-500' },
    absent: { color: 'bg-red-100 text-red-700 border-red-300', icon: 'fa-times-circle', iconColor: 'text-red-500' },
    late: { color: 'bg-amber-100 text-amber-700 border-amber-300', icon: 'fa-clock', iconColor: 'text-amber-500' },
    'half-day': { color: 'bg-blue-100 text-blue-700 border-blue-300', icon: 'fa-hourglass-half', iconColor: 'text-blue-500' },
    leave: { color: 'bg-purple-100 text-purple-700 border-purple-300', icon: 'fa-plane', iconColor: 'text-purple-500' },
  };

  const presentCount = dayAttendance.filter(a => a.status === 'present').length;
  const lateCount = dayAttendance.filter(a => a.status === 'late').length;
  const absentCount = dayAttendance.filter(a => a.status === 'absent').length;
  const leaveCount = dayAttendance.filter(a => a.status === 'leave').length;

  // Monthly summary
  const monthAttendance = attendance.filter(a => a.date.startsWith('2024-01'));
  const monthlyStats = employees.map(emp => {
    const empRecords = monthAttendance.filter(a => a.employeeId === emp.id);
    return {
      employee: emp,
      present: empRecords.filter(a => a.status === 'present').length,
      absent: empRecords.filter(a => a.status === 'absent').length,
      late: empRecords.filter(a => a.status === 'late').length,
      leave: empRecords.filter(a => a.status === 'leave').length,
      total: empRecords.length
    };
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Present', count: presentCount, color: 'from-green-400 to-green-600', icon: 'fa-check-circle', bg: 'bg-green-50' },
          { label: 'Late', count: lateCount, color: 'from-amber-400 to-amber-600', icon: 'fa-clock', bg: 'bg-amber-50' },
          { label: 'Absent', count: absentCount, color: 'from-red-400 to-red-600', icon: 'fa-times-circle', bg: 'bg-red-50' },
          { label: 'On Leave', count: leaveCount, color: 'from-purple-400 to-purple-600', icon: 'fa-plane', bg: 'bg-purple-50' },
          { label: 'Total Staff', count: employees.length, color: 'from-blue-400 to-blue-600', icon: 'fa-users', bg: 'bg-blue-50' },
        ].map((item, i) => (
          <div key={i} className={`${item.bg} rounded-xl p-4 border border-gray-100`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}>
                <i className={`fas ${item.icon} text-white text-sm`}></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{item.count}</p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <i className="fas fa-calendar text-red-500"></i>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
          <select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
          >
            <option value="all">All Departments</option>
            {['Health Services', 'Emergency Response', 'Logistics & Supply', 'Finance & Admin', 'Community Health', 'Water & Sanitation', 'First Aid Training', 'Youth & Volunteers'].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowMarkModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-500/25 flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          Mark Attendance
        </button>
      </div>

      {/* Daily Attendance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <i className="fas fa-list text-red-500"></i>
            Daily Attendance - {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Department</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Check In</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Check Out</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Hours</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Linked</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp, i) => {
                const record = getAttendanceForEmployee(emp.id);
                const config = record ? statusConfig[record.status] : statusConfig.absent;
                const hours = record?.checkIn && record?.checkOut
                  ? `${parseInt(record.checkOut) - parseInt(record.checkIn)}h`
                  : '-';

                return (
                  <tr key={emp.id} className={`border-b border-gray-50 hover:bg-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                          {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{emp.name}</p>
                          <p className="text-xs text-gray-400">{emp.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record?.checkIn || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record?.checkOut || '-'}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">{hours}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${config.color}`}>
                        <i className={`fas ${config.icon} ${config.iconColor}`}></i>
                        {record?.status || 'Not Marked'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {record && (
                        <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          <i className="fas fa-link text-[10px]"></i>
                          Linked
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <i className="fas fa-calendar-alt text-blue-500"></i>
            Monthly Summary - January 2024
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Employee</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-green-600 uppercase">Present</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-amber-600 uppercase">Late</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-red-600 uppercase">Absent</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-purple-600 uppercase">Leave</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rate</th>
              </tr>
            </thead>
            <tbody>
              {monthlyStats.map((stat, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">
                        {stat.employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{stat.employee.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 rounded-full text-sm font-bold">{stat.present}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">{stat.late}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-700 rounded-full text-sm font-bold">{stat.absent}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">{stat.leave}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full" style={{ width: `${stat.total > 0 ? (stat.present / stat.total) * 100 : 0}%` }}></div>
                      </div>
                      <span className="text-xs font-medium text-gray-600">{stat.total > 0 ? Math.round((stat.present / stat.total) * 100) : 0}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mark Attendance Modal */}
      {showMarkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowMarkModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Mark Attendance</h3>
              <button onClick={() => setShowMarkModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <i className="fas fa-times text-gray-500"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Employee</label>
                <select value={markForm.employeeId} onChange={e => setMarkForm({...markForm, employeeId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white">
                  <option value="">Select Employee</option>
                  {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeId})</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Status</label>
                <select value={markForm.status} onChange={e => setMarkForm({...markForm, status: e.target.value as AttendanceRecord['status']})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white">
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="absent">Absent</option>
                  <option value="half-day">Half Day</option>
                  <option value="leave">On Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Check In</label>
                  <input type="time" value={markForm.checkIn} onChange={e => setMarkForm({...markForm, checkIn: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Check Out</label>
                  <input type="time" value={markForm.checkOut} onChange={e => setMarkForm({...markForm, checkOut: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Notes</label>
                <textarea value={markForm.notes} onChange={e => setMarkForm({...markForm, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" rows={2} placeholder="Optional notes..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowMarkModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleMarkAttendance} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-500/25">
                Save Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

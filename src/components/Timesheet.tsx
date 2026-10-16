import { useState } from 'react';
import { Employee, TimesheetEntry } from '../types';
import { projects } from '../data';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  employees: Employee[];
  timesheets: TimesheetEntry[];
  setTimesheets: React.Dispatch<React.SetStateAction<TimesheetEntry[]>>;
}

export default function Timesheet({ employees, timesheets, setTimesheets }: Props) {
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]?.id || '');
  const [selectedWeek, setSelectedWeek] = useState('2024-01-15');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ date: '', project: projects[0], hours: 8, description: '' });

  // Get week dates
  const getWeekDates = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates(selectedWeek);
  const empTimesheets = timesheets.filter(t => t.employeeId === selectedEmployee);
  const currentEmp = employees.find(e => e.id === selectedEmployee);

  const getTimesheetForDate = (date: string) => {
    return empTimesheets.find(t => t.date === date);
  };

  const weekTotalHours = weekDates.reduce((sum, date) => {
    const ts = getTimesheetForDate(date);
    return sum + (ts?.hoursWorked || 0);
  }, 0);

  const handleAddEntry = () => {
    const newEntry: TimesheetEntry = {
      id: uuidv4(),
      employeeId: selectedEmployee,
      date: addForm.date,
      project: addForm.project,
      hoursWorked: addForm.hours,
      description: addForm.description,
      status: 'draft'
    };
    setTimesheets([...timesheets, newEntry]);
    setShowAddModal(false);
    setAddForm({ date: '', project: projects[0], hours: 8, description: '' });
  };

  const handleApprove = (id: string) => {
    setTimesheets(timesheets.map(t => t.id === id ? { ...t, status: 'approved' as const } : t));
  };

  const handleSubmit = (id: string) => {
    setTimesheets(timesheets.map(t => t.id === id ? { ...t, status: 'submitted' as const } : t));
  };

  const statusColors = {
    draft: 'bg-gray-100 text-gray-600 border-gray-200',
    submitted: 'bg-blue-100 text-blue-600 border-blue-200',
    approved: 'bg-green-100 text-green-600 border-green-200',
    rejected: 'bg-red-100 text-red-600 border-red-200',
  };

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Entries', value: empTimesheets.length, icon: 'fa-file-alt', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
          { label: 'Week Hours', value: `${weekTotalHours}h`, icon: 'fa-clock', color: 'from-green-500 to-green-600', bg: 'bg-green-50' },
          { label: 'Approved', value: empTimesheets.filter(t => t.status === 'approved').length, icon: 'fa-check-circle', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending', value: empTimesheets.filter(t => t.status === 'submitted').length, icon: 'fa-hourglass-half', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
        ].map((item, i) => (
          <div key={i} className={`${item.bg} rounded-xl p-4 border border-gray-100`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}>
                <i className={`fas ${item.icon} text-white text-sm`}></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          <select
            value={selectedEmployee}
            onChange={e => setSelectedEmployee(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
          >
            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeId})</option>)}
          </select>
          <div className="flex items-center gap-2">
            <i className="fas fa-calendar-week text-red-500"></i>
            <input
              type="date"
              value={selectedWeek}
              onChange={e => setSelectedWeek(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          Add Entry
        </button>
      </div>

      {/* Weekly Timesheet View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-calendar-week text-blue-500"></i>
              Weekly Timesheet - {currentEmp?.name}
            </h3>
            <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
              <i className="fas fa-clock text-blue-500 text-xs"></i>
              <span className="text-sm font-bold text-blue-700">Total: {weekTotalHours}h</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-100">
          {weekDates.map((date, i) => {
            const ts = getTimesheetForDate(date);
            const isWeekend = i >= 5;
            return (
              <div key={date} className={`p-3 ${isWeekend ? 'bg-gray-50' : 'bg-white'} min-h-[140px]`}>
                <div className="text-center mb-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase">{dayNames[i]}</p>
                  <p className="text-sm font-bold text-gray-700">{new Date(date).getDate()}</p>
                </div>
                {ts ? (
                  <div className="space-y-1">
                    <div className={`text-xs px-2 py-1 rounded-md border ${statusColors[ts.status]}`}>
                      {ts.status}
                    </div>
                    <p className="text-xs text-gray-600 truncate">{ts.project}</p>
                    <p className="text-lg font-bold text-gray-800">{ts.hoursWorked}h</p>
                    <div className="flex gap-1 mt-1">
                      {ts.status === 'draft' && (
                        <button onClick={() => handleSubmit(ts.id)} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">Submit</button>
                      )}
                      {ts.status === 'submitted' && (
                        <button onClick={() => handleApprove(ts.id)} className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded">Approve</button>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <i className="fas fa-link text-[8px] text-indigo-400"></i>
                      <span className="text-[9px] text-indigo-500">Linked to attendance</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center mt-4">
                    <p className="text-xs text-gray-300">{isWeekend ? 'Weekend' : 'No entry'}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* All Timesheets List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <i className="fas fa-list-alt text-purple-500"></i>
            All Timesheet Entries - {currentEmp?.name}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Project</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Hours</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Auto-Link</th>
              </tr>
            </thead>
            <tbody>
              {empTimesheets.slice(0, 20).map((ts, i) => (
                <tr key={ts.id} className={`border-b border-gray-50 hover:bg-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">{new Date(ts.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{ts.project}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-gray-800">{ts.hoursWorked}h</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-[200px]">{ts.description}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${statusColors[ts.status]}`}>
                      {ts.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                        <i className="fas fa-link text-[10px]"></i>
                        Attendance
                      </span>
                      {ts.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <i className="fas fa-money-bill text-[10px]"></i>
                          Payslip
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Add Timesheet Entry</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <i className="fas fa-times text-gray-500"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Date</label>
                <input type="date" value={addForm.date} onChange={e => setAddForm({...addForm, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Project</label>
                <select value={addForm.project} onChange={e => setAddForm({...addForm, project: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  {projects.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Hours Worked</label>
                <input type="number" min="0" max="24" value={addForm.hours} onChange={e => setAddForm({...addForm, hours: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Description</label>
                <textarea value={addForm.description} onChange={e => setAddForm({...addForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={3} placeholder="Describe work done..." />
              </div>
              <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                <div className="flex items-center gap-2">
                  <i className="fas fa-link text-indigo-500"></i>
                  <span className="text-xs text-indigo-700">This entry will be auto-linked to attendance records and payslip calculations</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleAddEntry} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25">
                Add Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

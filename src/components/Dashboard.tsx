import { Employee, AttendanceRecord, TimesheetEntry, Payslip } from '../types';

interface Props {
  employees: Employee[];
  attendance: AttendanceRecord[];
  timesheets: TimesheetEntry[];
  payslips: Payslip[];
}

export default function Dashboard({ employees, attendance, timesheets, payslips }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.status === 'present').length;
  const lateToday = todayAttendance.filter(a => a.status === 'late').length;
  const absentToday = todayAttendance.filter(a => a.status === 'absent').length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const approvedTimesheets = timesheets.filter(t => t.status === 'approved').length;
  const totalPayslips = payslips.length;
  const totalPayroll = payslips.reduce((sum, p) => sum + p.netPay, 0);

  const stats = [
    { label: 'Total Employees', value: employees.length, icon: 'fa-users', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', textColor: 'text-blue-700' },
    { label: 'Active Staff', value: activeEmployees, icon: 'fa-user-check', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', textColor: 'text-emerald-700' },
    { label: 'Present Today', value: presentToday, icon: 'fa-calendar-check', color: 'from-green-500 to-green-600', bg: 'bg-green-50', textColor: 'text-green-700' },
    { label: 'Late Today', value: lateToday, icon: 'fa-clock', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', textColor: 'text-amber-700' },
    { label: 'Absent Today', value: absentToday, icon: 'fa-user-xmark', color: 'from-red-500 to-red-600', bg: 'bg-red-50', textColor: 'text-red-700' },
    { label: 'Approved Timesheets', value: approvedTimesheets, icon: 'fa-file-check', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', textColor: 'text-purple-700' },
    { label: 'Payslips Generated', value: totalPayslips, icon: 'fa-money-bill-wave', color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', textColor: 'text-indigo-700' },
    { label: 'Total Payroll', value: `${(totalPayroll / 1000).toFixed(0)}K`, icon: 'fa-sack-dollar', color: 'from-teal-500 to-teal-600', bg: 'bg-teal-50', textColor: 'text-teal-700' },
  ];

  const departmentStats = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deptColors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500'];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl">☪</span>
            </div>
            <h1 className="text-2xl font-bold">YRCS Hodeidah HR Dashboard</h1>
          </div>
          <p className="text-red-100 text-sm">Welcome back! Here's your HR overview for today.</p>
          <div className="flex gap-4 mt-4">
            <div className="bg-white/15 rounded-lg px-4 py-2 backdrop-blur-sm">
              <p className="text-xs text-red-200">Attendance Rate</p>
              <p className="text-lg font-bold">{employees.length > 0 ? Math.round((presentToday / employees.length) * 100) : 0}%</p>
            </div>
            <div className="bg-white/15 rounded-lg px-4 py-2 backdrop-blur-sm">
              <p className="text-xs text-red-200">Timesheet Completion</p>
              <p className="text-lg font-bold">{timesheets.length > 0 ? Math.round((approvedTimesheets / timesheets.length) * 100) : 0}%</p>
            </div>
            <div className="bg-white/15 rounded-lg px-4 py-2 backdrop-blur-sm">
              <p className="text-xs text-red-200">Payroll Status</p>
              <p className="text-lg font-bold">{payslips.filter(p => p.status === 'paid').length}/{payslips.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <i className={`fas ${stat.icon} ${stat.textColor}`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-building text-red-500"></i>
            Department Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(departmentStats).map(([dept, count], i) => (
              <div key={dept} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${deptColors[i % deptColors.length]}`}></div>
                <span className="text-sm text-gray-600 flex-1">{dept}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${deptColors[i % deptColors.length]}`}
                      style={{ width: `${(count / employees.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-clock-rotate-left text-blue-500"></i>
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { action: 'Timesheet approved', emp: 'Ahmed Al-Hassan', time: '2 hours ago', icon: 'fa-check-circle', color: 'text-green-500' },
              { action: 'Attendance marked', emp: 'Fatima Al-Zahra', time: '3 hours ago', icon: 'fa-calendar-check', color: 'text-blue-500' },
              { action: 'Payslip generated', emp: 'Mohammed Ali Saeed', time: '5 hours ago', icon: 'fa-money-bill', color: 'text-purple-500' },
              { action: 'Leave request', emp: 'Nadia Hassan', time: '1 day ago', icon: 'fa-plane', color: 'text-amber-500' },
              { action: 'New employee added', emp: 'Yousef Abdullah', time: '2 days ago', icon: 'fa-user-plus', color: 'text-teal-500' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className={`fas ${activity.icon} ${activity.color} text-sm`}></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.emp}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-bolt text-amber-500"></i>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Mark Attendance', icon: 'fa-calendar-plus', color: 'bg-green-500' },
              { label: 'Create Timesheet', icon: 'fa-plus-circle', color: 'bg-blue-500' },
              { label: 'Generate Payslip', icon: 'fa-file-invoice-dollar', color: 'bg-purple-500' },
              { label: 'Add Employee', icon: 'fa-user-plus', color: 'bg-teal-500' },
              { label: 'View Reports', icon: 'fa-chart-bar', color: 'bg-amber-500' },
              { label: 'Send Reminder', icon: 'fa-bell', color: 'bg-red-500' },
            ].map((action, i) => (
              <button key={i} className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                  <i className={`fas ${action.icon} text-white text-xs`}></i>
                </div>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Auto-Link Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-link text-indigo-500"></i>
            Auto-Link Status
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <i className="fas fa-check-circle text-green-500"></i>
                <span className="text-sm font-medium text-green-700">Timesheet → Attendance</span>
              </div>
              <p className="text-xs text-green-600">All timesheets auto-linked with attendance records</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <i className="fas fa-check-circle text-blue-500"></i>
                <span className="text-sm font-medium text-blue-700">Attendance → Payslip</span>
              </div>
              <p className="text-xs text-blue-600">Attendance data feeds into payslip calculations</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <i className="fas fa-check-circle text-purple-500"></i>
                <span className="text-sm font-medium text-purple-700">Timesheet → Payslip</span>
              </div>
              <p className="text-xs text-purple-600">Approved timesheets auto-calculate overtime pay</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2 mb-1">
                <i className="fas fa-sync-alt text-amber-500"></i>
                <span className="text-sm font-medium text-amber-700">Full Sync Active</span>
              </div>
              <p className="text-xs text-amber-600">All modules synchronized and up to date</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

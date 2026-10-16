import { Employee, AttendanceRecord, TimesheetEntry, Payslip } from '../types';

interface Props {
  employees: Employee[];
  attendance: AttendanceRecord[];
  timesheets: TimesheetEntry[];
  payslips: Payslip[];
}

export default function Reports({ employees, attendance, timesheets, payslips }: Props) {
  const monthAttendance = attendance.filter(a => a.date.startsWith('2024-01'));
  
  // Department stats
  const deptStats = employees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = { count: 0, totalSalary: 0, present: 0, absent: 0 };
    }
    acc[emp.department].count++;
    acc[emp.department].totalSalary += emp.salary + emp.allowances;
    const empAtt = monthAttendance.filter(a => a.employeeId === emp.id);
    acc[emp.department].present += empAtt.filter(a => a.status === 'present').length;
    acc[emp.department].absent += empAtt.filter(a => a.status === 'absent').length;
    return acc;
  }, {} as Record<string, { count: number; totalSalary: number; present: number; absent: number }>);

  // Payroll summary by department
  const payrollByDept = employees.reduce((acc, emp) => {
    const ps = payslips.find(p => p.employeeId === emp.id);
    if (!acc[emp.department]) acc[emp.department] = { total: 0, count: 0 };
    acc[emp.department].total += ps?.netPay || 0;
    acc[emp.department].count++;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  // Attendance heatmap data (simplified)
  const dailyAttendance = Array.from({ length: 28 }, (_, i) => {
    const date = `2024-01-${String(i + 1).padStart(2, '0')}`;
    const dayAtt = attendance.filter(a => a.date === date);
    return {
      date,
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      present: dayAtt.filter(a => a.status === 'present').length,
      late: dayAtt.filter(a => a.status === 'late').length,
      absent: dayAtt.filter(a => a.status === 'absent').length,
    };
  });

  // Timesheet project distribution
  const projectStats = timesheets.reduce((acc, ts) => {
    acc[ts.project] = (acc[ts.project] || 0) + ts.hoursWorked;
    return acc;
  }, {} as Record<string, number>);

  const topProjects = Object.entries(projectStats).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxHours = Math.max(...Object.values(projectStats));

  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500', 'bg-teal-500', 'bg-pink-500', 'bg-indigo-500'];

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1">HR Analytics & Reports</h2>
          <p className="text-white/70 text-sm">YRCS Hodeidah - January 2024 Overview</p>
          <div className="flex gap-4 mt-4">
            <button className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 backdrop-blur-sm flex items-center gap-2">
              <i className="fas fa-download"></i> Export PDF
            </button>
            <button className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 backdrop-blur-sm flex items-center gap-2">
              <i className="fas fa-file-excel"></i> Export Excel
            </button>
            <button onClick={() => window.print()} className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 backdrop-blur-sm flex items-center gap-2">
              <i className="fas fa-print"></i> Print Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg. Attendance Rate', value: `${Math.round((monthAttendance.filter(a => a.status === 'present').length / Math.max(monthAttendance.length, 1)) * 100)}%`, icon: 'fa-chart-pie', color: 'from-green-400 to-green-600' },
          { label: 'Total Work Hours', value: `${timesheets.reduce((sum, t) => sum + t.hoursWorked, 0).toLocaleString()}h`, icon: 'fa-business-time', color: 'from-blue-400 to-blue-600' },
          { label: 'Monthly Payroll', value: `${(payslips.reduce((sum, p) => sum + p.netPay, 0) / 1000000).toFixed(1)}M`, icon: 'fa-money-bill-trend-up', color: 'from-purple-400 to-purple-600' },
          { label: 'Overtime Cost', value: `${(payslips.reduce((sum, p) => sum + p.overtime, 0) / 1000).toFixed(0)}K`, icon: 'fa-clock', color: 'from-amber-400 to-amber-600' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}>
                <i className={`fas ${item.icon} text-white text-sm`}></i>
              </div>
              <div>
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-xl font-bold text-gray-800">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Overview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-building text-red-500"></i>
            Department Overview
          </h3>
          <div className="space-y-4">
            {Object.entries(deptStats).map(([dept, stats], i) => (
              <div key={dept} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colors[i % colors.length]}`}></div>
                    <span className="text-sm font-medium text-gray-700">{dept}</span>
                  </div>
                  <span className="text-xs text-gray-500">{stats.count} staff</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-white rounded-lg p-2 text-center">
                    <p className="text-gray-400">Salary</p>
                    <p className="font-semibold text-gray-700">{(stats.totalSalary / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center">
                    <p className="text-gray-400">Present</p>
                    <p className="font-semibold text-green-600">{stats.present}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center">
                    <p className="text-gray-400">Absent</p>
                    <p className="font-semibold text-red-600">{stats.absent}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Hours Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-project-diagram text-blue-500"></i>
            Project Hours Distribution
          </h3>
          <div className="space-y-3">
            {topProjects.map(([project, hours], i) => (
              <div key={project}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 truncate flex-1">{project}</span>
                  <span className="text-sm font-bold text-gray-700 ml-2">{hours}h</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colors[i % colors.length]} transition-all duration-500`}
                    style={{ width: `${(hours / maxHours) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Attendance Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-chart-bar text-green-500"></i>
            Daily Attendance - January 2024
          </h3>
          <div className="overflow-x-auto">
            <div className="flex items-end gap-1 min-w-[600px] h-48">
              {dailyAttendance.map((day, i) => {
                const total = day.present + day.late + day.absent;
                const maxTotal = employees.length;
                const height = total > 0 ? (total / maxTotal) * 100 : 0;
                const presentH = total > 0 ? (day.present / total) * height : 0;
                const lateH = total > 0 ? (day.late / total) * height : 0;
                const absentH = total > 0 ? (day.absent / total) * height : 0;
                const isWeekend = day.day === 'Sat' || day.day === 'Sun';

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col justify-end h-36">
                      {isWeekend ? (
                        <div className="w-full h-2 bg-gray-200 rounded-t"></div>
                      ) : (
                        <div className="w-full flex flex-col justify-end" style={{ height: `${Math.max(height, 5)}%` }}>
                          <div className="w-full bg-red-400 rounded-t-sm" style={{ height: `${absentH}%` }} title={`Absent: ${day.absent}`}></div>
                          <div className="w-full bg-amber-400" style={{ height: `${lateH}%` }} title={`Late: ${day.late}`}></div>
                          <div className="w-full bg-green-400 rounded-b-sm" style={{ height: `${presentH}%` }} title={`Present: ${day.present}`}></div>
                        </div>
                      )}
                    </div>
                    <span className={`text-[9px] ${isWeekend ? 'text-gray-300' : 'text-gray-500'}`}>{day.day}</span>
                    <span className="text-[9px] text-gray-400">{i + 1}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 justify-center">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                <span className="text-xs text-gray-500">Present</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-amber-400 rounded-sm"></div>
                <span className="text-xs text-gray-500">Late</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-400 rounded-sm"></div>
                <span className="text-xs text-gray-500">Absent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payroll by Department */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-money-bill-wave text-purple-500"></i>
            Payroll by Department
          </h3>
          <div className="space-y-3">
            {Object.entries(payrollByDept).sort((a, b) => b[1].total - a[1].total).map(([dept, data], i) => {
              const maxPayroll = Math.max(...Object.values(payrollByDept).map(d => d.total));
              return (
                <div key={dept} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${colors[i % colors.length]}`}></div>
                  <span className="text-sm text-gray-600 flex-1 truncate">{dept}</span>
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colors[i % colors.length]}`} style={{ width: `${(data.total / maxPayroll) * 100}%` }}></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-20 text-right">{(data.total / 1000).toFixed(0)}K</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Employee Performance */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="fas fa-star text-amber-500"></i>
            Top Performers
          </h3>
          <div className="space-y-3">
            {employees.slice(0, 5).map((emp, i) => {
              const empAtt = monthAttendance.filter(a => a.employeeId === emp.id);
              const empTs = timesheets.filter(t => t.employeeId === emp.id && t.status === 'approved');
              const totalHours = empTs.reduce((sum, t) => sum + t.hoursWorked, 0);
              const attendanceRate = empAtt.length > 0 ? Math.round((empAtt.filter(a => a.status === 'present').length / empAtt.length) * 100) : 0;
              const score = Math.round((attendanceRate * 0.5) + (Math.min(totalHours / 160, 1) * 50));

              return (
                <div key={emp.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-amber-700' : 'bg-gray-300'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{emp.name}</p>
                    <p className="text-xs text-gray-400">{emp.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">{score}%</p>
                    <p className="text-[10px] text-gray-400">{totalHours}h worked</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Data Linking Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fas fa-sitemap text-indigo-500"></i>
          Auto-Link Data Flow Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-calendar-check text-white text-lg"></i>
            </div>
            <h4 className="font-bold text-blue-800">Attendance</h4>
            <p className="text-xs text-blue-600 mt-1">{attendance.length} records</p>
            <div className="mt-3 flex items-center justify-center gap-1">
              <i className="fas fa-arrow-down text-blue-400"></i>
              <span className="text-[10px] text-blue-500">Feeds into payslip deductions</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-clock text-white text-lg"></i>
            </div>
            <h4 className="font-bold text-green-800">Timesheet</h4>
            <p className="text-xs text-green-600 mt-1">{timesheets.length} entries</p>
            <div className="mt-3 flex items-center justify-center gap-1">
              <i className="fas fa-arrow-down text-green-400"></i>
              <span className="text-[10px] text-green-500">Approved entries → overtime calc</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-money-bill-wave text-white text-lg"></i>
            </div>
            <h4 className="font-bold text-purple-800">Payslip</h4>
            <p className="text-xs text-purple-600 mt-1">{payslips.length} generated</p>
            <div className="mt-3 flex items-center justify-center gap-1">
              <i className="fas fa-check-circle text-purple-400"></i>
              <span className="text-[10px] text-purple-500">Auto-calculated from above</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

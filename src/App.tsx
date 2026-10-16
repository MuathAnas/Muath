import { useState } from 'react';
import { TabType, Employee, AttendanceRecord, TimesheetEntry, Payslip } from './types';
import { initialEmployees, initialAttendance, initialTimesheets, initialPayslips } from './data';
import Dashboard from './components/Dashboard';
import Employees from './components/Employees';
import Attendance from './components/Attendance';
import Timesheet from './components/Timesheet';
import PayslipPage from './components/PayslipPage';
import Reports from './components/Reports';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(initialTimesheets);
  const [payslips, setPayslips] = useState<Payslip[]>(initialPayslips);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'employees', label: 'Employees', icon: 'fa-users' },
    { id: 'attendance', label: 'Attendance', icon: 'fa-calendar-check' },
    { id: 'timesheet', label: 'Timesheet', icon: 'fa-clock' },
    { id: 'payslip', label: 'Payslip', icon: 'fa-money-bill-wave' },
    { id: 'reports', label: 'Reports', icon: 'fa-file-alt' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard employees={employees} attendance={attendance} timesheets={timesheets} payslips={payslips} />;
      case 'employees':
        return <Employees employees={employees} setEmployees={setEmployees} />;
      case 'attendance':
        return <Attendance employees={employees} attendance={attendance} setAttendance={setAttendance} />;
      case 'timesheet':
        return <Timesheet employees={employees} timesheets={timesheets} setTimesheets={setTimesheets} />;
      case 'payslip':
        return <PayslipPage employees={employees} payslips={payslips} setPayslips={setPayslips} attendance={attendance} timesheets={timesheets} />;
      case 'reports':
        return <Reports employees={employees} attendance={attendance} timesheets={timesheets} payslips={payslips} />;
      default:
        return <Dashboard employees={employees} attendance={attendance} timesheets={timesheets} payslips={payslips} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-gradient-to-b from-red-700 via-red-800 to-red-900 text-white flex flex-col shadow-2xl`}>
        {/* Logo */}
        <div className="p-4 border-b border-red-600/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-red-700 font-bold text-lg">☪</span>
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-sm leading-tight">YRCS</h1>
                <p className="text-xs text-red-200 leading-tight">Hodeidah Branch</p>
                <p className="text-[10px] text-red-300">HR Management</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                  : 'text-red-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center text-lg`}></i>
              {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-red-600/50">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <p className="text-xs text-red-200">Yemen Red Crescent Society</p>
              <p className="text-xs text-red-300 mt-1">Hodeidah Governorate</p>
              <p className="text-[10px] text-red-400 mt-1">v2.0 - HR System</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-bars text-gray-600"></i>
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-800 capitalize">{activeTab}</h2>
              <p className="text-sm text-gray-500">YRCS Hodeidah - {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                <i className="fas fa-bell text-gray-600"></i>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">HR</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">HR Admin</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { Employee, Payslip, AttendanceRecord, TimesheetEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  employees: Employee[];
  payslips: Payslip[];
  setPayslips: React.Dispatch<React.SetStateAction<Payslip[]>>;
  attendance: AttendanceRecord[];
  timesheets: TimesheetEntry[];
}

export default function PayslipPage({ employees, payslips, setPayslips, attendance, timesheets }: Props) {
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [genForm, setGenForm] = useState({ employeeId: '', period: 'January 2024' });
  const [filterStatus, setFilterStatus] = useState('all');

  const generatePayslip = () => {
    const emp = employees.find(e => e.id === genForm.employeeId);
    if (!emp) return;

    const empAttendance = attendance.filter(a => a.employeeId === emp.id);
    const empTimesheets = timesheets.filter(t => t.employeeId === emp.id && t.status === 'approved');
    const overtimeHours = empTimesheets.reduce((acc, t) => acc + Math.max(0, t.hoursWorked - 8), 0);
    const overtimePay = overtimeHours * (emp.salary / 160) * 1.5;
    const absentDays = empAttendance.filter(a => a.status === 'absent').length;
    const deductions = absentDays * (emp.salary / 22);
    const tax = (emp.salary + emp.allowances + overtimePay - deductions) * 0.05;
    const netPay = emp.salary + emp.allowances + overtimePay - deductions - tax;

    const newPayslip: Payslip = {
      id: uuidv4(),
      employeeId: emp.id,
      period: genForm.period,
      basicSalary: emp.salary,
      allowances: emp.allowances,
      overtime: Math.round(overtimePay),
      deductions: Math.round(deductions),
      tax: Math.round(tax),
      netPay: Math.round(netPay),
      status: 'generated',
      generatedDate: new Date().toISOString().split('T')[0],
      linkedTimesheets: empTimesheets.map(t => t.id),
      linkedAttendance: empAttendance.map(a => a.id)
    };

    setPayslips([...payslips, newPayslip]);
    setShowGenerateModal(false);
  };

  const handleApprove = (id: string) => {
    setPayslips(payslips.map(p => p.id === id ? { ...p, status: 'approved' as const } : p));
  };

  const handleMarkPaid = (id: string) => {
    setPayslips(payslips.map(p => p.id === id ? { ...p, status: 'paid' as const } : p));
  };

  const filteredPayslips = filterStatus === 'all' ? payslips : payslips.filter(p => p.status === filterStatus);
  const totalPayroll = payslips.reduce((sum, p) => sum + p.netPay, 0);
  const paidAmount = payslips.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.netPay, 0);

  const statusColors = {
    draft: 'bg-gray-100 text-gray-600 border-gray-200',
    generated: 'bg-blue-100 text-blue-600 border-blue-200',
    approved: 'bg-green-100 text-green-600 border-green-200',
    paid: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Payslips', value: payslips.length, icon: 'fa-file-invoice-dollar', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
          { label: 'Total Payroll', value: `${(totalPayroll / 1000).toFixed(0)}K`, icon: 'fa-sack-dollar', color: 'from-green-500 to-green-600', bg: 'bg-green-50' },
          { label: 'Paid Amount', value: `${(paidAmount / 1000).toFixed(0)}K`, icon: 'fa-check-double', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending', value: payslips.filter(p => p.status !== 'paid').length, icon: 'fa-hourglass-half', color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
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
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="generated">Generated</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg shadow-purple-500/25 flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          Generate Payslip
        </button>
      </div>

      {/* Payslips List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPayslips.map(payslip => {
          const emp = employees.find(e => e.id === payslip.employeeId);
          return (
            <div key={payslip.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer overflow-hidden" onClick={() => setSelectedPayslip(payslip)}>
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-100">Payslip</p>
                    <p className="text-lg font-bold">{payslip.period}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[payslip.status]}`}>
                    {payslip.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    {emp?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{emp?.name}</p>
                    <p className="text-xs text-gray-500">{emp?.employeeId} • {emp?.department}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-400">Basic</p>
                    <p className="font-semibold text-gray-700">{payslip.basicSalary.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-400">Allowances</p>
                    <p className="font-semibold text-gray-700">{payslip.allowances.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-400">Overtime</p>
                    <p className="font-semibold text-green-600">+{payslip.overtime.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-400">Deductions</p>
                    <p className="font-semibold text-red-600">-{payslip.deductions.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Net Pay</p>
                    <p className="text-xl font-bold text-purple-700">{payslip.netPay.toLocaleString()} <span className="text-xs font-normal">YER</span></p>
                  </div>
                  <div className="flex gap-1">
                    <span className="inline-flex items-center gap-1 text-[10px] text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                      <i className="fas fa-link"></i>
                      {payslip.linkedTimesheets.length} TS
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      <i className="fas fa-link"></i>
                      {payslip.linkedAttendance.length} ATT
                    </span>
                  </div>
                </div>
                {payslip.status !== 'paid' && (
                  <div className="mt-3 flex gap-2">
                    {payslip.status === 'generated' && (
                      <button onClick={(e) => { e.stopPropagation(); handleApprove(payslip.id); }}
                        className="flex-1 text-xs py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-medium">
                        <i className="fas fa-check mr-1"></i>Approve
                      </button>
                    )}
                    {(payslip.status === 'approved' || payslip.status === 'generated') && (
                      <button onClick={(e) => { e.stopPropagation(); handleMarkPaid(payslip.id); }}
                        className="flex-1 text-xs py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 font-medium">
                        <i className="fas fa-money-bill mr-1"></i>Mark Paid
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payslip Detail Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPayslip(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full p-0 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Payslip Header */}
            <div className="bg-gradient-to-r from-red-700 via-red-800 to-red-900 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-xl">☪</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">YRCS Hodeidah Branch</h3>
                    <p className="text-xs text-red-200">Yemen Red Crescent Society</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Payslip</p>
                  <p className="text-xs text-red-200">{selectedPayslip.period}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Employee Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {(() => {
                  const emp = employees.find(e => e.id === selectedPayslip.employeeId);
                  return (
                    <>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400">Employee Name</p>
                        <p className="font-semibold text-gray-700">{emp?.name}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400">Employee ID</p>
                        <p className="font-semibold text-gray-700">{emp?.employeeId}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400">Department</p>
                        <p className="font-semibold text-gray-700">{emp?.department}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400">Position</p>
                        <p className="font-semibold text-gray-700">{emp?.position}</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Salary Breakdown */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <i className="fas fa-calculator text-purple-500"></i>
                  Salary Breakdown
                </h4>
                <div className="bg-gray-50 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-3 border-b border-gray-200 bg-gray-100">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500">Description</div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 text-right">Amount (YER)</div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 text-right">Type</div>
                  </div>
                  {[
                    { desc: 'Basic Salary', amount: selectedPayslip.basicSalary, type: 'earning' },
                    { desc: 'Allowances', amount: selectedPayslip.allowances, type: 'earning' },
                    { desc: 'Overtime Pay', amount: selectedPayslip.overtime, type: 'earning' },
                    { desc: 'Deductions (Absent Days)', amount: selectedPayslip.deductions, type: 'deduction' },
                    { desc: 'Tax (5%)', amount: selectedPayslip.tax, type: 'deduction' },
                  ].map((item, i) => (
                    <div key={i} className="grid grid-cols-3 border-b border-gray-100">
                      <div className="px-4 py-3 text-sm text-gray-700">{item.desc}</div>
                      <div className={`px-4 py-3 text-sm text-right font-semibold ${item.type === 'earning' ? 'text-green-600' : 'text-red-600'}`}>
                        {item.type === 'earning' ? '+' : '-'}{item.amount.toLocaleString()}
                      </div>
                      <div className="px-4 py-3 text-right">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${item.type === 'earning' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {item.type}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="grid grid-cols-3 bg-purple-50">
                    <div className="px-4 py-3 text-sm font-bold text-purple-800">Net Pay</div>
                    <div className="px-4 py-3 text-sm text-right font-bold text-purple-800">{selectedPayslip.netPay.toLocaleString()} YER</div>
                    <div className="px-4 py-3"></div>
                  </div>
                </div>
              </div>

              {/* Auto-Link Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fas fa-clock text-blue-500"></i>
                    <span className="text-sm font-semibold text-blue-700">Linked Timesheets</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-800">{selectedPayslip.linkedTimesheets.length}</p>
                  <p className="text-xs text-blue-500 mt-1">Approved entries auto-calculated</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="fas fa-calendar-check text-green-500"></i>
                    <span className="text-sm font-semibold text-green-700">Linked Attendance</span>
                  </div>
                  <p className="text-2xl font-bold text-green-800">{selectedPayslip.linkedAttendance.length}</p>
                  <p className="text-xs text-green-500 mt-1">Records used for calculation</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-400">
                  <p>Generated: {selectedPayslip.generatedDate}</p>
                  <p>Status: <span className="font-medium capitalize">{selectedPayslip.status}</span></p>
                </div>
                <button onClick={() => window.print()} className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg text-sm font-medium hover:from-red-700 hover:to-red-800 flex items-center gap-2">
                  <i className="fas fa-print"></i>
                  Print Payslip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Payslip Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowGenerateModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Generate Payslip</h3>
              <button onClick={() => setShowGenerateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <i className="fas fa-times text-gray-500"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Employee</label>
                <select value={genForm.employeeId} onChange={e => setGenForm({...genForm, employeeId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white">
                  <option value="">Select Employee</option>
                  {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeId})</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Period</label>
                <input type="text" value={genForm.period} onChange={e => setGenForm({...genForm, period: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="flex items-start gap-2">
                  <i className="fas fa-info-circle text-purple-500 mt-0.5"></i>
                  <div className="text-xs text-purple-700">
                    <p className="font-medium mb-1">Auto-Calculation will include:</p>
                    <ul className="space-y-1 text-purple-600">
                      <li>• Basic salary from employee record</li>
                      <li>• Allowances from employee record</li>
                      <li>• Overtime from approved timesheets</li>
                      <li>• Deductions from absent days in attendance</li>
                      <li>• Tax at 5% rate</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowGenerateModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={generatePayslip} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/25">
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  joinDate: string;
  salary: number;
  allowances: number;
  status: 'active' | 'inactive' | 'on-leave';
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'leave';
  notes: string;
}

export interface TimesheetEntry {
  id: string;
  employeeId: string;
  date: string;
  project: string;
  hoursWorked: number;
  description: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

export interface Payslip {
  id: string;
  employeeId: string;
  period: string;
  basicSalary: number;
  allowances: number;
  overtime: number;
  deductions: number;
  tax: number;
  netPay: number;
  status: 'draft' | 'generated' | 'approved' | 'paid';
  generatedDate: string;
  linkedTimesheets: string[];
  linkedAttendance: string[];
}

export type TabType = 'dashboard' | 'employees' | 'attendance' | 'timesheet' | 'payslip' | 'reports' | 'apk';

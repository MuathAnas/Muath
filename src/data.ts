import { Employee, AttendanceRecord, TimesheetEntry, Payslip } from './types';
import { v4 as uuidv4 } from 'uuid';

export const departments = [
  'Health Services',
  'Emergency Response',
  'Logistics & Supply',
  'Finance & Admin',
  'Community Health',
  'Water & Sanitation',
  'First Aid Training',
  'Youth & Volunteers'
];

export const projects = [
  'Emergency Medical Response',
  'Community Health Outreach',
  'Disaster Preparedness',
  'Refugee Support Program',
  'Water Distribution',
  'First Aid Training Campaign',
  'Blood Donation Drive',
  'Administrative Operations'
];

export const initialEmployees: Employee[] = [
  {
    id: uuidv4(),
    name: 'Ahmed Al-Hassan',
    employeeId: 'YRCS-001',
    department: 'Health Services',
    position: 'Medical Director',
    email: 'ahmed.hassan@yrcs-hod.org',
    phone: '+967-3-258-001',
    joinDate: '2020-03-15',
    salary: 450000,
    allowances: 75000,
    status: 'active'
  },
  {
    id: uuidv4(),
    name: 'Fatima Al-Zahra',
    employeeId: 'YRCS-002',
    department: 'Emergency Response',
    position: 'Emergency Coordinator',
    email: 'fatima.zahra@yrcs-hod.org',
    phone: '+967-3-258-002',
    joinDate: '2021-01-10',
    salary: 380000,
    allowances: 60000,
    status: 'active'
  },
  {
    id: uuidv4(),
    name: 'Mohammed Ali Saeed',
    employeeId: 'YRCS-003',
    department: 'Logistics & Supply',
    position: 'Logistics Manager',
    email: 'mohammed.saeed@yrcs-hod.org',
    phone: '+967-3-258-003',
    joinDate: '2019-07-22',
    salary: 350000,
    allowances: 55000,
    status: 'active'
  },
  {
    id: uuidv4(),
    name: 'Sara Ibrahim',
    employeeId: 'YRCS-004',
    department: 'Finance & Admin',
    position: 'Finance Officer',
    email: 'sara.ibrahim@yrcs-hod.org',
    phone: '+967-3-258-004',
    joinDate: '2022-02-01',
    salary: 320000,
    allowances: 50000,
    status: 'active'
  },
  {
    id: uuidv4(),
    name: 'Omar Khalid',
    employeeId: 'YRCS-005',
    department: 'Community Health',
    position: 'Health Educator',
    email: 'omar.khalid@yrcs-hod.org',
    phone: '+967-3-258-005',
    joinDate: '2021-09-15',
    salary: 280000,
    allowances: 45000,
    status: 'active'
  },
  {
    id: uuidv4(),
    name: 'Nadia Hassan',
    employeeId: 'YRCS-006',
    department: 'Water & Sanitation',
    position: 'WASH Specialist',
    email: 'nadia.hassan@yrcs-hod.org',
    phone: '+967-3-258-006',
    joinDate: '2020-11-20',
    salary: 340000,
    allowances: 52000,
    status: 'on-leave'
  },
  {
    id: uuidv4(),
    name: 'Yousef Abdullah',
    employeeId: 'YRCS-007',
    department: 'First Aid Training',
    position: 'Training Coordinator',
    email: 'yousef.abdullah@yrcs-hod.org',
    phone: '+967-3-258-007',
    joinDate: '2022-05-10',
    salary: 290000,
    allowances: 48000,
    status: 'active'
  },
  {
    id: uuidv4(),
    name: 'Amina Saleh',
    employeeId: 'YRCS-008',
    department: 'Youth & Volunteers',
    position: 'Volunteer Manager',
    email: 'amina.saleh@yrcs-hod.org',
    phone: '+967-3-258-008',
    joinDate: '2021-04-18',
    salary: 300000,
    allowances: 47000,
    status: 'active'
  }
];

function generateAttendance(employees: Employee[]): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const statuses: AttendanceRecord['status'][] = ['present', 'present', 'present', 'present', 'late', 'absent', 'half-day', 'leave'];
  const checkInTimes = ['07:45', '07:50', '07:55', '08:00', '08:15', '08:30', '08:45'];
  const checkOutTimes = ['16:00', '16:15', '16:30', '16:45', '17:00'];

  for (const emp of employees) {
    for (let day = 1; day <= 28; day++) {
      const date = `2024-01-${String(day).padStart(2, '0')}`;
      const dayOfWeek = new Date(date).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends

      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const checkIn = status === 'absent' || status === 'leave' ? '' : checkInTimes[Math.floor(Math.random() * checkInTimes.length)];
      const checkOut = status === 'absent' || status === 'leave' || status === 'half-day' ? (status === 'half-day' ? '12:00' : '') : checkOutTimes[Math.floor(Math.random() * checkOutTimes.length)];

      records.push({
        id: uuidv4(),
        employeeId: emp.id,
        date,
        checkIn,
        checkOut,
        status,
        notes: status === 'late' ? 'Traffic delay' : status === 'absent' ? 'Personal emergency' : ''
      });
    }
  }
  return records;
}

function generateTimesheets(employees: Employee[]): TimesheetEntry[] {
  const entries: TimesheetEntry[] = [];
  const statuses: TimesheetEntry['status'][] = ['approved', 'approved', 'submitted', 'draft'];

  for (const emp of employees) {
    for (let day = 1; day <= 28; day++) {
      const date = `2024-01-${String(day).padStart(2, '0')}`;
      const dayOfWeek = new Date(date).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      entries.push({
        id: uuidv4(),
        employeeId: emp.id,
        date,
        project: projects[Math.floor(Math.random() * projects.length)],
        hoursWorked: Math.random() > 0.3 ? 8 : Math.floor(Math.random() * 4) + 4,
        description: 'Daily operations and assigned tasks',
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }
  }
  return entries;
}

export const initialAttendance = generateAttendance(initialEmployees);
export const initialTimesheets = generateTimesheets(initialEmployees);

export const initialPayslips: Payslip[] = initialEmployees.map(emp => {
  const empTimesheets = initialTimesheets.filter(t => t.employeeId === emp.id && t.status === 'approved');
  const empAttendance = initialAttendance.filter(a => a.employeeId === emp.id && a.status === 'present');
  const overtimeHours = empTimesheets.reduce((acc, t) => acc + Math.max(0, t.hoursWorked - 8), 0);
  const overtimePay = overtimeHours * (emp.salary / 160) * 1.5;
  const deductions = empAttendance.filter(a => a.status === 'absent').length * (emp.salary / 22);
  const tax = (emp.salary + emp.allowances + overtimePay - deductions) * 0.05;
  const netPay = emp.salary + emp.allowances + overtimePay - deductions - tax;

  return {
    id: uuidv4(),
    employeeId: emp.id,
    period: 'January 2024',
    basicSalary: emp.salary,
    allowances: emp.allowances,
    overtime: Math.round(overtimePay),
    deductions: Math.round(deductions),
    tax: Math.round(tax),
    netPay: Math.round(netPay),
    status: 'generated',
    generatedDate: '2024-01-31',
    linkedTimesheets: empTimesheets.map(t => t.id),
    linkedAttendance: empAttendance.map(a => a.id)
  };
});

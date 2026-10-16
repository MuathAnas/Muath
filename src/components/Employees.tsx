import { useState } from 'react';
import { Employee } from '../types';
import { departments } from '../data';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}

export default function Employees({ employees, setEmployees }: Props) {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '', employeeId: '', department: departments[0], position: '',
    email: '', phone: '', salary: '', allowances: ''
  });

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === 'all' || e.department === filterDept;
    return matchSearch && matchDept;
  });

  const handleAdd = () => {
    const newEmp: Employee = {
      id: uuidv4(),
      name: formData.name,
      employeeId: formData.employeeId || `YRCS-${String(employees.length + 1).padStart(3, '0')}`,
      department: formData.department,
      position: formData.position,
      email: formData.email,
      phone: formData.phone,
      joinDate: new Date().toISOString().split('T')[0],
      salary: Number(formData.salary) || 0,
      allowances: Number(formData.allowances) || 0,
      status: 'active'
    };
    setEmployees([...employees, newEmp]);
    setShowModal(false);
    setFormData({ name: '', employeeId: '', department: departments[0], position: '', email: '', phone: '', salary: '', allowances: '' });
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700 border-green-200',
    inactive: 'bg-gray-100 text-gray-700 border-gray-200',
    'on-leave': 'bg-amber-100 text-amber-700 border-amber-200'
  };

  const avatarColors = [
    'from-red-400 to-red-600', 'from-blue-400 to-blue-600', 'from-green-400 to-green-600',
    'from-purple-400 to-purple-600', 'from-amber-400 to-amber-600', 'from-teal-400 to-teal-600',
    'from-pink-400 to-pink-600', 'from-indigo-400 to-indigo-600'
  ];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-3 flex-1 w-full md:w-auto">
          <div className="relative flex-1">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none bg-white"
          >
            <option value="all">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-500/25 flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          Add Employee
        </button>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((emp, i) => (
          <div
            key={emp.id}
            onClick={() => setSelectedEmployee(emp)}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-red-200 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${avatarColors[i % avatarColors.length]} rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}>
                {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors">{emp.name}</h3>
                <p className="text-sm text-gray-500">{emp.position}</p>
                <p className="text-xs text-gray-400 mt-1">{emp.employeeId}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[emp.status]}`}>
                {emp.status}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-gray-400">Department</p>
                <p className="font-medium text-gray-700 truncate">{emp.department}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <p className="text-gray-400">Salary</p>
                <p className="font-medium text-gray-700">{emp.salary.toLocaleString()} YER</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
              <i className="fas fa-envelope"></i>
              <span className="truncate">{emp.email}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEmployee(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Employee Details</h3>
              <button onClick={() => setSelectedEmployee(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <i className="fas fa-times text-gray-500"></i>
              </button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                {selectedEmployee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">{selectedEmployee.name}</h4>
                <p className="text-gray-500">{selectedEmployee.position}</p>
                <span className={`text-xs px-2 py-1 rounded-full border mt-1 inline-block ${statusColors[selectedEmployee.status]}`}>
                  {selectedEmployee.status}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Employee ID', value: selectedEmployee.employeeId, icon: 'fa-id-badge' },
                { label: 'Department', value: selectedEmployee.department, icon: 'fa-building' },
                { label: 'Email', value: selectedEmployee.email, icon: 'fa-envelope' },
                { label: 'Phone', value: selectedEmployee.phone, icon: 'fa-phone' },
                { label: 'Join Date', value: selectedEmployee.joinDate, icon: 'fa-calendar' },
                { label: 'Salary', value: `${selectedEmployee.salary.toLocaleString()} YER`, icon: 'fa-money-bill' },
                { label: 'Allowances', value: `${selectedEmployee.allowances.toLocaleString()} YER`, icon: 'fa-coins' },
                { label: 'Total Package', value: `${(selectedEmployee.salary + selectedEmployee.allowances).toLocaleString()} YER`, icon: 'fa-sack-dollar' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <i className={`fas ${item.icon} text-red-400 text-xs`}></i>
                    <span className="text-xs text-gray-400">{item.label}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Add New Employee</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <i className="fas fa-times text-gray-500"></i>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600 mb-1 block">Full Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="Enter full name" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Employee ID</label>
                <input type="text" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="Auto-generated" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Department</label>
                <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white">
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600 mb-1 block">Position</label>
                <input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="Enter position" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="email@yrcs-hod.org" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Phone</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="+967-3-xxx-xxx" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Salary (YER)</label>
                <input type="number" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="0" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Allowances (YER)</label>
                <input type="number" value={formData.allowances} onChange={e => setFormData({...formData, allowances: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="0" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleAdd} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-500/25">
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

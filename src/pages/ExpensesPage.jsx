import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { 
  Receipt, 
  Plus, 
  Search, 
  TrendingDown, 
  Calendar, 
  Filter,
  DollarSign,
  Briefcase,
  Lightbulb,
  Truck,
  MoreHorizontal
} from 'lucide-react';

const ExpensesPage = () => {
  const [showModal, setShowModal] = useState(false);

  const expenses = [
    { id: 'EXP-001', title: 'Monthly Shop Rent', category: 'Rent', amount: 35000, date: '2023-10-01', status: 'Paid' },
    { id: 'EXP-002', title: 'Fabric Purchase - Silk', category: 'Materials', amount: 12500, date: '2023-10-05', status: 'Paid' },
    { id: 'EXP-003', title: 'Electricity Bill', category: 'Utilities', amount: 4200, date: '2023-10-10', status: 'Pending' },
    { id: 'EXP-004', title: 'Tailor Salaries', category: 'Salaries', amount: 45000, date: '2023-10-15', status: 'Paid' },
  ];

  const categories = [
    { name: 'Rent', icon: <Briefcase size={20} />, color: 'bg-blue-50 text-blue-600', count: 1 },
    { name: 'Materials', icon: <Receipt size={20} />, color: 'bg-purple-50 text-purple-600', count: 5 },
    { name: 'Utilities', icon: <Lightbulb size={20} />, color: 'bg-amber-50 text-amber-600', count: 3 },
    { name: 'Transport', icon: <Truck size={20} />, color: 'bg-emerald-50 text-emerald-600', count: 2 },
  ];

  return (
    <div className="bg-slate-50 min-h-screen relative overflow-x-hidden">
      <Header />
      <Sidebar />
      
      <main className="w-full p-4 md:p-8 pt-44 lg:pt-40">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Expense Tracking</h1>
            <p className="text-slate-500 font-medium mt-1">Monitor business costs to calculate real profit.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl hover:bg-slate-800 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span>Record Expense</span>
          </button>
        </header>

        {/* Expense Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                <TrendingDown size={28} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">This Month</span>
            </div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Total Expenses</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">KSh 96,700</h3>
          </div>

          <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex gap-8">
              {categories.map((cat, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 ${cat.color} rounded-2xl flex items-center justify-center`}>
                    {cat.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-500">{cat.name}</span>
                </div>
              ))}
            </div>
            <div className="h-full w-px bg-slate-100 mx-8"></div>
            <div className="flex-1">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-slate-800">Budget Usage</span>
                <span className="text-sm font-black text-slate-900">72%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{width: '72%'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Table (Desktop) / Cards (Mobile) */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-black text-slate-900">Expense History</h3>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative group flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" size={18} />
                <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-4 focus:ring-blue-500/5 transition-all" />
              </div>
              <button className="p-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-all">
                <Filter size={18} />
              </button>
            </div>
          </div>
          
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Expense Title</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
                  <th className="px-8 py-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                          <Receipt size={18} />
                        </div>
                        <span className="font-bold text-slate-800">{exp.title}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-slate-500 text-sm font-medium">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        exp.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {exp.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-slate-900">KSh {exp.amount.toLocaleString()}</td>
                    <td className="px-8 py-5">
                      <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-slate-50">
            {expenses.map((exp) => (
              <div key={exp.id} className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <Receipt size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{exp.title}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(exp.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    exp.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {exp.status}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                  <span className="text-sm font-black text-slate-900">KSh {exp.amount.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{exp.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Record Expense Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden fade-in">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900">Record Expense</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-rose-500 transition-colors">✕</button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Expense Title</label>
                  <input type="text" placeholder="e.g. Electricity Bill" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Category</label>
                    <select className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all font-medium appearance-none">
                      <option>Rent</option>
                      <option>Materials</option>
                      <option>Utilities</option>
                      <option>Salaries</option>
                      <option>Transport</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 ml-1">Amount (KSh)</label>
                    <input type="number" placeholder="0" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-rose-500/10 transition-all font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Expense Date</label>
                  <input type="date" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all font-medium" />
                </div>
              </div>
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                <button onClick={() => setShowModal(false)} className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-white/80 transition-all">Cancel</button>
                <button className="px-10 py-3 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:shadow-slate-900/40 transition-all">Save Expense</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ExpensesPage;

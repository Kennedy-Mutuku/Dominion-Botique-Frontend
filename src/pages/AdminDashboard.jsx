import React from 'react';
import Sidebar from '../components/Sidebar';
import { 
  TrendingUp, 
  ShoppingBag, 
  Scissors, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Search,
  Bell
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const data = [
  { name: 'Mon', sales: 4000, profit: 2400 },
  { name: 'Tue', sales: 3000, profit: 1398 },
  { name: 'Wed', sales: 2000, profit: 9800 },
  { name: 'Thu', sales: 2780, profit: 3908 },
  { name: 'Fri', sales: 1890, profit: 4800 },
  { name: 'Sat', sales: 2390, profit: 3800 },
  { name: 'Sun', sales: 3490, profit: 4300 },
];

const COLORS = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981'];

import Header from '../components/Header';

const AdminDashboard = () => {
  return (
    <div className="bg-slate-50 min-h-screen relative overflow-x-hidden">
      <Header />

      <Sidebar />
      
      <main className="w-full p-4 md:p-8 pt-44 lg:pt-40">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Overview</h1>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Real-time Performance Insights</p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative group flex-1 lg:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search analytics..."
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all w-full md:w-64"
              />
            </div>
            <div className="flex items-center gap-3 bg-white p-1.5 pr-4 border border-slate-100 rounded-2xl shadow-sm">
              <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center text-white shadow-md font-bold">
                K
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Kennedy</p>
                <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Revenue', value: 'KSh 45,231', trend: '+12.5%', up: true, icon: <TrendingUp className="text-blue-600" />, bg: 'bg-blue-50' },
            { label: 'Daily Sales', value: '12', trend: '+3', up: true, icon: <ShoppingBag className="text-purple-600" />, bg: 'bg-purple-50' },
            { label: 'Pending Orders', value: '8', trend: '-2', up: false, icon: <Scissors className="text-amber-600" />, bg: 'bg-amber-50' },
            { label: 'Active Customers', value: '156', trend: '+18', up: true, icon: <Users className="text-emerald-600" />, bg: 'bg-emerald-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-900">Sales Trend</h3>
              <select className="bg-slate-50 border-none rounded-lg text-sm font-bold text-slate-600 focus:ring-0 cursor-pointer">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dx={-10} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    itemStyle={{fontWeight: 700}}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-8">Product Categories</h3>
            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Dresses', value: 400 },
                      { name: 'Suits', value: 300 },
                      { name: 'Shirts', value: 300 },
                      { name: 'Uniforms', value: 200 },
                    ]}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {COLORS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-2xl font-black text-slate-900">1.2k</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Items</p>
              </div>
            </div>
            <div className="space-y-3 mt-4">
              {['Dresses', 'Suits', 'Shirts', 'Uniforms'].map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                    <span className="text-sm font-bold text-slate-600">{cat}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{(400 - i*50)} units</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900">Recent Transactions</h3>
            <button className="text-blue-600 font-bold text-sm hover:underline">View All History</button>
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Product</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
                  <th className="px-8 py-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { name: 'John Doe', item: 'Silk Wedding Suit', date: 'Oct 24, 2023', status: 'Completed', amount: 'KSh 12,500' },
                  { name: 'Sarah Ken', item: 'Floral Summer Dress', date: 'Oct 23, 2023', status: 'Pending', amount: 'KSh 4,200' },
                  { name: 'Mike Ross', item: 'Office Cotton Shirt', date: 'Oct 23, 2023', status: 'Completed', amount: 'KSh 2,800' },
                  { name: 'Lilian Kamau', item: 'School Uniform Set', date: 'Oct 22, 2023', status: 'Processing', amount: 'KSh 3,500' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                          {row.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-slate-600 font-medium">{row.item}</td>
                    <td className="px-8 py-5 text-slate-500 text-sm font-medium">{row.date}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        row.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                        row.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-slate-900">{row.amount}</td>
                    <td className="px-8 py-5">
                      <button className="p-2 text-slate-400 hover:text-slate-800 transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-slate-50">
            {[
              { name: 'John Doe', item: 'Silk Wedding Suit', date: 'Oct 24, 2023', status: 'Completed', amount: 'KSh 12,500' },
              { name: 'Sarah Ken', item: 'Floral Summer Dress', date: 'Oct 23, 2023', status: 'Pending', amount: 'KSh 4,200' },
              { name: 'Mike Ross', item: 'Office Cotton Shirt', date: 'Oct 23, 2023', status: 'Completed', amount: 'KSh 2,800' },
              { name: 'Lilian Kamau', item: 'School Uniform Set', date: 'Oct 22, 2023', status: 'Processing', amount: 'KSh 3,500' },
            ].map((row, i) => (
              <div key={i} className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                      {row.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{row.name}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.date}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    row.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                    row.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {row.status}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                  <span className="text-xs font-bold text-slate-600">{row.item}</span>
                  <span className="text-sm font-black text-slate-900">{row.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

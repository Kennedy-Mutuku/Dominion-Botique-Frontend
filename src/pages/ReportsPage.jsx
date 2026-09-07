import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Download, Calendar, Filter, TrendingUp, DollarSign, ShoppingBag, PieChart as PieIcon } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', revenue: 45000, profit: 12000, expenses: 33000 },
  { month: 'Feb', revenue: 52000, profit: 15000, expenses: 37000 },
  { month: 'Mar', revenue: 48000, profit: 11000, expenses: 37000 },
  { month: 'Apr', revenue: 61000, profit: 22000, expenses: 39000 },
  { month: 'May', revenue: 55000, profit: 18000, expenses: 37000 },
  { month: 'Jun', revenue: 67000, profit: 25000, expenses: 42000 },
];

const ReportsPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen relative overflow-x-hidden">
      <Header />
      <Sidebar />
      
      <main className="w-full p-4 md:p-8 pt-44 lg:pt-40">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Professional Analytics</h1>
            <p className="text-slate-500 font-medium mt-1">Detailed insights into your business growth and performance.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm shadow-sm">
              <Calendar size={18} />
              <span>Year 2023</span>
            </div>
            <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl hover:bg-slate-800 transition-all">
              <Download size={20} />
              <span>Download Report</span>
            </button>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Annual Revenue', value: 'KSh 642.5K', icon: <TrendingUp className="text-blue-500" />, color: 'text-blue-600' },
            { label: 'Annual Profit', value: 'KSh 185.2K', icon: <DollarSign className="text-emerald-500" />, color: 'text-emerald-600' },
            { label: 'Total Sales', value: '1,452', icon: <ShoppingBag className="text-purple-500" />, color: 'text-purple-600' },
            { label: 'Avg. Order Value', value: 'KSh 4,425', icon: <PieIcon className="text-amber-500" />, color: 'text-amber-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                  {stat.icon}
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
              <h3 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="space-y-8">
          {/* Revenue vs Expenses Bar Chart */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-slate-900">Revenue vs. Expenses</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Expenses</span>
                </div>
              </div>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dx={-10} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                  <Bar dataKey="expenses" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Profit Trend Line Chart */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-10">Profit Growth Trend</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                    <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={4} dot={{r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff'}} activeDot={{r: 8}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-8">Performance Insights</h3>
              <div className="space-y-6">
                {[
                  { title: 'Best Selling Category', desc: 'Wedding Suits (Increased by 24% this month)', score: 92, color: 'bg-emerald-500' },
                  { title: 'Customer Retention', desc: 'Repeat customers account for 45% of sales', score: 78, color: 'bg-blue-500' },
                  { title: 'Tailoring Efficiency', desc: 'Average turnaround time: 4.2 days', score: 85, color: 'bg-purple-500' },
                  { title: 'Low Stock Alert', desc: '12 items are below reorder point', score: 32, color: 'bg-rose-500' },
                ].map((insight, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="font-black text-slate-800 text-sm">{insight.title}</p>
                        <p className="text-xs font-medium text-slate-500">{insight.desc}</p>
                      </div>
                      <span className="text-sm font-black text-slate-900">{insight.score}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${insight.color} rounded-full`} style={{width: `${insight.score}%`}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportsPage;

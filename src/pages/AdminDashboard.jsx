import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp, TrendingDown, Package, ShoppingCart, DollarSign,
  BarChart2, LogOut, Calendar, RefreshCw, LayoutDashboard, Users,
  FileText, Scissors, Archive, ArrowRightLeft, PieChart as PieChartIcon
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import logo from '../assets/logo bq.png';

const BAR_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#f59e0b'];

const fmt = (n) => `KSh ${Math.round(n).toLocaleString()}`;

const SIDEBAR_LINKS = [
  { name: 'Dashboard Overview', path: '/admin', icon: <LayoutDashboard size={18} />, color: 'bg-blue-500' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const today = new Date().toISOString().split('T')[0];
  const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString().split('T')[0];

  const [fromDate, setFromDate] = useState(firstDay);
  const [toDate, setToDate] = useState(today);
  const [stock, setStock] = useState([]);
  const [sales, setSales] = useState([]);

  const loadData = useCallback(() => {
    const s = localStorage.getItem('lucy_stock');
    const sl = localStorage.getItem('lucy_sales');
    setStock(s ? JSON.parse(s) : []);
    setSales(sl ? JSON.parse(sl) : []);
  }, []);

  useEffect(() => {
    loadData();
    const onStorage = (e) => {
      if (e.key === 'lucy_stock' || e.key === 'lucy_sales') loadData();
    };
    window.addEventListener('storage', onStorage);
    const interval = setInterval(loadData, 30000);
    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, [loadData]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filtered sales by date range
  const filteredSales = sales.filter(s => s.date >= fromDate && s.date <= toDate);

  // Summary metrics
  const totalRevenue = filteredSales.reduce((sum, s) => sum + (s.soldPrice || 0), 0);
  const totalProfit = filteredSales.reduce((sum, s) => sum + (s.profit || 0), 0);
  const totalCost = stock.reduce((sum, s) => sum + (s.quantity || 0) * (s.buyingPrice || 0), 0);
  const stockValue = stock.reduce((sum, s) => sum + (s.quantity || 0) * (s.price || 0), 0);
  const salesCount = filteredSales.length;

  // Trend chart: group by date
  const salesByDate = filteredSales.reduce((acc, s) => {
    const d = s.date;
    if (!acc[d]) acc[d] = { date: d, revenue: 0, profit: 0 };
    acc[d].revenue += s.soldPrice || 0;
    acc[d].profit += s.profit || 0;
    return acc;
  }, {});
  const trendData = Object.values(salesByDate)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => ({ ...d, date: d.date.slice(5) }));

  // Top 5 products by revenue
  const productRevenue = filteredSales.reduce((acc, s) => {
    const name = s.name || s.productName || 'Unknown';
    acc[name] = (acc[name] || 0) + (s.soldPrice || 0);
    return acc;
  }, {});
  const topProducts = Object.entries(productRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, revenue]) => ({ name, revenue }));

  // Recent sales newest first
  const recentSales = [...filteredSales].sort((a, b) => {
    const da = `${a.date}${a.time || ''}`;
    const db = `${b.date}${b.time || ''}`;
    return db.localeCompare(da);
  });

  const profitPositive = totalProfit >= 0;

  const topCards = [
    {
      label: 'Total Revenue', value: fmt(totalRevenue),
      icon: <DollarSign size={40} />,
      bg: 'bg-[#3b82f6]', // Blue
    },
    {
      label: 'Sales Count', value: salesCount.toString(),
      icon: <ShoppingCart size={40} />,
      bg: 'bg-[#ef4444]', // Red
    },
    {
      label: 'Total Profit', value: fmt(totalProfit),
      icon: profitPositive ? <TrendingUp size={40} /> : <TrendingDown size={40} />,
      bg: 'bg-[#10b981]', // Green
    },
    {
      label: 'Stock Value', value: fmt(stockValue),
      icon: <Package size={40} />,
      bg: 'bg-[#8b5cf6]', // Purple
    }
  ];

  const tooltipStyle = {
    contentStyle: {
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      color: '#1e293b',
      fontSize: '12px',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    },
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col text-slate-800 font-sans">
      
      {/* Top Header */}
      <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
            <img src={logo} alt="Logo" className="h-5 w-auto brightness-0 invert" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">Admin Overview</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs shadow-inner">
            <Calendar size={14} className="text-slate-400" />
            <input
              type="date" value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none w-[105px]"
            />
            <span className="text-slate-300">-</span>
            <input
              type="date" value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none w-[105px]"
            />
          </div>
          
          <button
            onClick={loadData}
            title="Refresh"
            className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
          >
            <RefreshCw size={18} />
          </button>
          
          <div className="h-8 w-px bg-slate-200 mx-1" />
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700 leading-tight">Admin User</p>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Nyakoe Fassions</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center text-sm font-black shadow-sm">
                A
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-rose-500 hover:text-white transition-colors rounded-lg hover:bg-rose-500 bg-rose-50 border border-rose-100"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          
          {/* Top Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {topCards.map((card, i) => (
              <div key={i} className={`${card.bg} rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between h-32 transform transition-transform hover:-translate-y-1`}>
                <div className="relative z-10">
                  <h3 className="text-3xl font-black mb-1 drop-shadow-sm">{card.value}</h3>
                  <p className="text-sm font-medium opacity-90">{card.label}</p>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                  {card.icon}
                </div>
                <div className="absolute -right-4 -top-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl" />
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            
            {/* Sales & Profit Trend (Area Chart) */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BarChart2 size={18} className="text-blue-500" />
                Sales & Profit Trend
              </h3>
              {trendData.length === 0 ? (
                <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No sales in this date range
                </div>
              ) : (
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} dx={-10} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                      <Tooltip {...tooltipStyle} formatter={(v, name) => [`KSh ${v.toLocaleString()}`, name]} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 500, paddingTop: '10px' }} />
                      <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                      <Area type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Top Products (Pie Chart) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                <PieChartIcon size={18} className="text-emerald-500" />
                Top Products by Revenue
              </h3>
              {topProducts.length === 0 ? (
                <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No data
                </div>
              ) : (
                <div className="h-[280px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topProducts}
                        cx="50%" cy="45%"
                        innerRadius={60} outerRadius={85}
                        paddingAngle={5}
                        dataKey="revenue"
                        nameKey="name"
                      >
                        {topProducts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip {...tooltipStyle} formatter={(v) => [`KSh ${v.toLocaleString()}`, 'Revenue']} />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 500 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Tables Row */}
          <div className="grid lg:grid-cols-2 gap-6 pb-8">
            
            {/* Recent Sales Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-bold text-slate-800">Recent Sales</h3>
              </div>
              {recentSales.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-sm">No sales in this date range</div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto p-2">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0">Product</th>
                        <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0 text-right">Price</th>
                        <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0 text-right">Profit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentSales.slice(0, 30).map((sale, i) => {
                        const profit = sale.profit || 0;
                        const name = sale.name || sale.productName || 'Unknown';
                        const profitPos = profit >= 0;
                        return (
                          <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-4 py-3">
                              <p className="text-sm font-semibold text-slate-700 truncate max-w-[180px]">{name}</p>
                              <p className="text-[10px] font-medium text-slate-400 mt-0.5">{sale.date}</p>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <p className="text-sm font-bold text-slate-800">KSh {(sale.soldPrice || 0).toLocaleString()}</p>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className={`text-[11px] font-bold px-2 py-1 rounded-md ${profitPos ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {profitPos ? '+' : ''}KSh {Math.abs(profit).toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Current Stock Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-bold text-slate-800">Current Stock</h3>
              </div>
              {stock.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-sm">No stock added yet</div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto p-2">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0">Product</th>
                        <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0 text-right">Pricing</th>
                        <th className="px-4 py-3 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0 text-center">Qty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {stock.map((item, i) => {
                        const qty = item.quantity || 0;
                        const qtyColor = qty >= 5 ? 'text-emerald-600 bg-emerald-50' : qty >= 1 ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50';
                        const name = item.name || item.productName || 'Unknown';
                        return (
                          <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-4 py-3">
                              <p className="text-sm font-semibold text-slate-700 truncate max-w-[180px]">{name}</p>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <p className="text-[11px] font-semibold text-slate-500">Buy: KSh {(item.buyingPrice || 0).toLocaleString()}</p>
                              <p className="text-xs font-bold text-slate-800 mt-0.5">Sell: KSh {(item.price || 0).toLocaleString()}</p>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-black ${qtyColor}`}>
                                {qty}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </main>
    </div>
  );
};

export default AdminDashboard;

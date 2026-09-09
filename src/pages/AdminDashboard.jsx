import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp, TrendingDown, Package, ShoppingCart, DollarSign,
  BarChart2, LogOut, Calendar, RefreshCw, LayoutDashboard, Users,
  FileText, Scissors, Archive, ArrowRightLeft, PieChart as PieChartIcon,
  Search
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
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

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [stock, setStock] = useState([]);
  const [sales, setSales] = useState([]);
  const [salesSearch, setSalesSearch] = useState('');
  const [stockSearch, setStockSearch] = useState('');

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

  // Filtered sales by date range (if no date is set, show all)
  const filteredSales = sales.filter(s => {
    const afterFrom = fromDate ? s.date >= fromDate : true;
    const beforeTo = toDate ? s.date <= toDate : true;
    return afterFrom && beforeTo;
  });

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

  // Recent sales newest first, with search filter
  const recentSales = [...filteredSales].sort((a, b) => {
    const da = `${a.date}${a.time || ''}`;
    const db = `${b.date}${b.time || ''}`;
    return db.localeCompare(da);
  }).filter(s => {
    if (!salesSearch) return true;
    const term = salesSearch.toLowerCase();
    const name = (s.name || s.productName || '').toLowerCase();
    const date = (s.date || '').toLowerCase();
    const time = (s.time || '').toLowerCase();
    const price = (s.soldPrice || '').toString();
    const profit = (s.profit || '').toString();
    return name.includes(term) || date.includes(term) || time.includes(term) || price.includes(term) || profit.includes(term);
  });

  const displayStock = stock.filter(item => {
    if (!stockSearch) return true;
    const term = stockSearch.toLowerCase();
    const name = (item.name || item.productName || '').toLowerCase();
    const date = (item.date || '').toLowerCase();
    const time = (item.time || '').toLowerCase();
    const buy = (item.buyingPrice || '').toString();
    const sell = (item.price || '').toString();
    const qty = (item.quantity || '').toString();
    return name.includes(term) || date.includes(term) || time.includes(term) || buy.includes(term) || sell.includes(term) || qty.includes(term);
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
            
            {/* Profit & Loss Trend */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BarChart2 size={18} className="text-blue-500" />
                Profit & Loss Trend
              </h3>
              {trendData.length === 0 ? (
                <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No data in this date range
                </div>
              ) : (
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData.map(d => ({ ...d, profit: d.profit, loss: d.revenue - d.profit }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} dx={-10} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                      <Tooltip {...tooltipStyle} formatter={(v, name) => [`KSh ${v.toLocaleString()}`, name]} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 500, paddingTop: '10px' }} />
                      <Line type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="loss" name="Loss" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
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
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Recent Sales</h3>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search sales..."
                    value={salesSearch}
                    onChange={(e) => setSalesSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm w-48 transition-all"
                  />
                </div>
              </div>
              {recentSales.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-sm">No sales in this date range</div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto p-2">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="pl-4 pr-2 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0 w-8">#</th>
                        <th className="px-2 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0">Product & Time</th>
                        <th className="px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0 text-right">Price</th>
                        <th className="px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0 text-right">Profit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentSales.slice(0, 30).map((sale, i) => {
                        const profit = sale.profit || 0;
                        const name = sale.name || sale.productName || 'Unknown';
                        const profitPos = profit >= 0;
                        const timeStr = sale.time ? ` • ${sale.time}` : '';
                        return (
                          <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                            <td className="pl-4 pr-2 py-1.5">
                              <span className="text-[10px] font-black text-slate-300">{(i + 1).toString().padStart(2, '0')}</span>
                            </td>
                            <td className="px-2 py-1.5">
                              <p className="text-[13px] font-semibold text-slate-700 truncate max-w-[160px] leading-tight">{name}</p>
                              <p className="text-[9px] font-medium text-slate-400 mt-0.5 tracking-wide">{sale.date}{timeStr}</p>
                            </td>
                            <td className="px-4 py-1.5 text-right">
                              <p className="text-[12px] font-bold text-slate-800">KSh {(sale.soldPrice || 0).toLocaleString()}</p>
                            </td>
                            <td className="px-4 py-1.5 text-right">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${profitPos ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
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
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Current Stock</h3>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search stock..."
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm w-48 transition-all"
                  />
                </div>
              </div>
              {stock.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-sm">No stock added yet</div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto p-2">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="pl-4 pr-2 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0 w-8">#</th>
                        <th className="px-2 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0">Product & Time</th>
                        <th className="px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0 text-right">Pricing</th>
                        <th className="px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0 text-center">Qty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {displayStock.map((item, i) => {
                        const qty = item.quantity || 0;
                        const qtyColor = qty >= 5 ? 'text-emerald-600 bg-emerald-50' : qty >= 1 ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50';
                        const name = item.name || item.productName || 'Unknown';
                        const timeStr = item.time ? ` • ${item.time}` : '';
                        const dateStr = item.date || 'Unknown Date';
                        return (
                          <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                            <td className="pl-4 pr-2 py-1.5">
                              <span className="text-[10px] font-black text-slate-300">{(i + 1).toString().padStart(2, '0')}</span>
                            </td>
                            <td className="px-2 py-1.5">
                              <p className="text-[13px] font-semibold text-slate-700 truncate max-w-[160px] leading-tight">{name}</p>
                              <p className="text-[9px] font-medium text-slate-400 mt-0.5 tracking-wide">{dateStr}{timeStr}</p>
                            </td>
                            <td className="px-4 py-1.5 text-right">
                              <p className="text-[10px] font-semibold text-slate-500">Buy: KSh {(item.buyingPrice || 0).toLocaleString()}</p>
                              <p className="text-[12px] font-bold text-slate-800 mt-0.5">Sell: KSh {(item.price || 0).toLocaleString()}</p>
                            </td>
                            <td className="px-4 py-1.5 text-center">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-black ${qtyColor}`}>
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

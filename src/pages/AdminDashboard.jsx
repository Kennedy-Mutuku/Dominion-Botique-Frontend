import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp, TrendingDown, Package, ShoppingCart, DollarSign,
  BarChart2, LogOut, Calendar, RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import logo from '../assets/logo bq.png';

const BAR_COLORS = ['#f43f5e', '#e879f9', '#a78bfa', '#38bdf8', '#34d399'];

const fmt = (n) => `KSh ${Math.round(n).toLocaleString()}`;

const AdminDashboard = () => {
  const navigate = useNavigate();
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
  const avgSalePrice = salesCount > 0 ? totalRevenue / salesCount : 0;

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

  const cards = [
    {
      label: 'Total Revenue', value: fmt(totalRevenue),
      icon: <TrendingUp size={18} />, color: 'text-rose-400',
      bg: 'bg-rose-500/10', border: 'border-rose-500/20',
    },
    {
      label: 'Total Profit', value: fmt(totalProfit),
      icon: profitPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />,
      color: profitPositive ? 'text-emerald-400' : 'text-rose-400',
      bg: profitPositive ? 'bg-emerald-500/10' : 'bg-rose-500/10',
      border: profitPositive ? 'border-emerald-500/20' : 'border-rose-500/20',
    },
    {
      label: 'Total Cost (Buying)', value: fmt(totalCost),
      icon: <DollarSign size={18} />, color: 'text-amber-400',
      bg: 'bg-amber-500/10', border: 'border-amber-500/20',
    },
    {
      label: 'Stock Value (Retail)', value: fmt(stockValue),
      icon: <Package size={18} />, color: 'text-violet-400',
      bg: 'bg-violet-500/10', border: 'border-violet-500/20',
    },
    {
      label: 'Sales Count', value: salesCount.toString(),
      icon: <ShoppingCart size={18} />, color: 'text-sky-400',
      bg: 'bg-sky-500/10', border: 'border-sky-500/20',
    },
    {
      label: 'Avg Sale Price', value: fmt(avgSalePrice),
      icon: <BarChart2 size={18} />, color: 'text-fuchsia-400',
      bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20',
    },
  ];

  const tooltipStyle = {
    contentStyle: {
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '12px',
      color: '#fff',
      fontSize: '12px',
    },
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-9 w-auto brightness-0 invert opacity-80" />
            <div>
              <h1 className="text-sm font-bold tracking-widest uppercase text-white leading-none"
                style={{ fontFamily: 'Georgia, serif' }}>
                Nyakoe Fassions
              </h1>
              <p className="text-[9px] font-bold tracking-[0.3em] text-rose-400 uppercase mt-0.5">Admin Portal</p>
            </div>
          </div>

          {/* Date filter */}
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs">
            <Calendar size={13} className="text-slate-400 flex-shrink-0" />
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">From</span>
            <input
              type="date" value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none w-[105px]"
            />
            <div className="w-px h-4 bg-slate-600" />
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">To</span>
            <input
              type="date" value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none w-[105px]"
            />
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              title="Refresh"
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
            >
              <RefreshCw size={15} />
            </button>
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-fuchsia-500 flex items-center justify-center text-xs font-black">
                A
              </div>
              <span className="text-sm font-bold text-white hidden sm:block">Admin</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 hover:text-rose-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              <LogOut size={13} />
              <span className="hidden sm:block">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <div key={i} className={`bg-slate-800 border ${card.border} rounded-2xl p-5`}>
              <div className="flex items-start justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-tight pr-2">
                  {card.label}
                </p>
                <div className={`${card.bg} p-2 rounded-xl ${card.color} flex-shrink-0`}>
                  {card.icon}
                </div>
              </div>
              <p className={`text-xl md:text-2xl font-black ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* ── Charts ── */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Area: Sales & Profit Trend */}
          <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-white mb-5">
              Sales & Profit Trend
            </h3>
            {trendData.length === 0 ? (
              <div className="h-[240px] flex items-center justify-center text-slate-500 text-sm">
                No sales in this date range
              </div>
            ) : (
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} dx={-8}
                      tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                    <Tooltip
                      {...tooltipStyle}
                      formatter={(v, name) => [`KSh ${v.toLocaleString()}`, name]}
                    />
                    <Area type="monotone" dataKey="revenue" name="Revenue"
                      stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#gradRev)" />
                    <Area type="monotone" dataKey="profit" name="Profit"
                      stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#gradProfit)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Bar: Top Products */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-white mb-5">
              Top Products by Revenue
            </h3>
            {topProducts.length === 0 ? (
              <div className="h-[240px] flex items-center justify-center text-slate-500 text-sm">
                No data
              </div>
            ) : (
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="vertical" margin={{ left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                    <XAxis type="number" axisLine={false} tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10 }} width={72}
                      tickFormatter={(v) => v.length > 10 ? v.slice(0, 10) + '…' : v} />
                    <Tooltip
                      {...tooltipStyle}
                      formatter={(v) => [`KSh ${v.toLocaleString()}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                      {topProducts.map((_, index) => (
                        <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* ── Tables ── */}
        <div className="grid lg:grid-cols-2 gap-6 pb-8">

          {/* Recent Sales */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700">
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Recent Sales</h3>
            </div>
            {recentSales.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No sales in this date range</div>
            ) : (
              <div className="divide-y divide-slate-700/50 max-h-[360px] overflow-y-auto">
                {recentSales.slice(0, 30).map((sale, i) => {
                  const profit = sale.profit || 0;
                  const name = sale.name || sale.productName || 'Unknown';
                  const profitPos = profit >= 0;
                  return (
                    <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-slate-700/30 transition-colors">
                      <div className="min-w-0 mr-3">
                        <p className="text-sm font-bold text-white truncate">{name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {sale.date}{sale.time ? ` · ${sale.time}` : ''}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-black text-white">
                          KSh {(sale.soldPrice || 0).toLocaleString()}
                        </p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${profitPos ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                          {profitPos ? '+' : ''}KSh {Math.abs(profit).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Current Stock */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700">
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Current Stock</h3>
            </div>
            {stock.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No stock added yet</div>
            ) : (
              <div className="divide-y divide-slate-700/50 max-h-[360px] overflow-y-auto">
                {stock.map((item, i) => {
                  const qty = item.quantity || 0;
                  const qtyColor = qty >= 5 ? 'text-emerald-400' : qty >= 1 ? 'text-amber-400' : 'text-rose-400';
                  const name = item.name || item.productName || 'Unknown';
                  return (
                    <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-slate-700/30 transition-colors">
                      <div className="min-w-0 mr-3">
                        <p className="text-sm font-bold text-white truncate">{name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Buy: KSh {(item.buyingPrice || 0).toLocaleString()} · Sell: KSh {(item.price || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`text-xl font-black ${qtyColor}`}>{qty}</span>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest">units</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;

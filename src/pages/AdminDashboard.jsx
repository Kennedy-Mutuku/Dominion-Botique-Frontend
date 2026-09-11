import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp, TrendingDown, Package, ShoppingCart, DollarSign,
  BarChart2, LogOut, Calendar, RefreshCw, LayoutDashboard, Users,
  FileText, Scissors, Archive, ArrowRightLeft, PieChart as PieChartIcon,
  Search, Menu, X, Bell, ChevronRight
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
  const [tailoringOrders, setTailoringOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salesSearch, setSalesSearch] = useState('');
  const [stockSearch, setStockSearch] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
    setTimeout(() => setIsRefreshing(false), 500); // 500ms spin for visual feedback
  };

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    localStorage.setItem('lucy_notifications', JSON.stringify(updated));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const quickLinks = [
    { label: 'Overview', id: 'overview' },
    { label: 'Profit & Loss', id: 'profit-loss' },
    { label: 'Top Products', id: 'top-products' },
    { label: 'Recent Sales', id: 'recent-sales' },
    { label: 'Current Stock', id: 'current-stock' },
    { label: 'Tailoring & Customers', id: 'tailoring' },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  const salesScrollRef = useRef(null);
  const stockScrollRef = useRef(null);

  const handleBackgroundClick = (e) => {
    // Check if the click was outside the scrollable areas
    const clickedInsideSales = salesScrollRef.current && salesScrollRef.current.contains(e.target);
    const clickedInsideStock = stockScrollRef.current && stockScrollRef.current.contains(e.target);

    if (!clickedInsideSales && salesScrollRef.current) {
      salesScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (!clickedInsideStock && stockScrollRef.current) {
      stockScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const loadData = useCallback(() => {
    const s = localStorage.getItem('lucy_stock');
    const sl = localStorage.getItem('lucy_sales');
    
    const parsedStock = s ? JSON.parse(s) : [];
    const parsedSales = sl ? JSON.parse(sl) : [];
    
    setStock(parsedStock);
    setSales(parsedSales);
    try {
      setTailoringOrders(JSON.parse(localStorage.getItem('lucy_tailoring_orders') || '[]'));
      setCustomers(JSON.parse(localStorage.getItem('lucy_customers') || '[]'));
    } catch(e) {}

    // Notification Engine
    const lastSalesStr = localStorage.getItem('lucy_last_sales_count');
    const lastStockStr = localStorage.getItem('lucy_last_stock_count');
    let newNotifs = [];

    // Check for new sales
    if (!lastSalesStr) {
      localStorage.setItem('lucy_last_sales_count', parsedSales.length.toString());
    } else {
      const lastSalesCount = parseInt(lastSalesStr, 10);
      if (parsedSales.length > lastSalesCount) {
        const addedSales = parsedSales.slice(lastSalesCount);
        addedSales.forEach(sale => {
          newNotifs.unshift({
            id: Date.now() + Math.random(),
            type: 'sale',
            title: 'New Sale Recorded',
            message: `${sale.name || sale.productName || 'A product'} sold for KSh ${sale.soldPrice || 0}`,
            time: new Date().toISOString(),
            isRead: false
          });
        });
        localStorage.setItem('lucy_last_sales_count', parsedSales.length.toString());
      }
    }

    // Check for new stock
    if (!lastStockStr) {
      localStorage.setItem('lucy_last_stock_count', parsedStock.length.toString());
    } else {
      const lastStockCount = parseInt(lastStockStr, 10);
      if (parsedStock.length > lastStockCount) {
        const addedStock = parsedStock.slice(lastStockCount);
        addedStock.forEach(item => {
          newNotifs.unshift({
            id: Date.now() + Math.random(),
            type: 'stock',
            title: 'New Stock Added',
            message: `${item.quantity || 0}x ${item.name || item.productName || 'product'} added`,
            time: new Date().toISOString(),
            isRead: false
          });
        });
        localStorage.setItem('lucy_last_stock_count', parsedStock.length.toString());
      }
    }

    // Update notifications in state and local storage
    if (newNotifs.length > 0) {
      const existingNotifs = JSON.parse(localStorage.getItem('lucy_notifications') || '[]');
      const combined = [...newNotifs, ...existingNotifs].slice(0, 50); // Keep latest 50
      localStorage.setItem('lucy_notifications', JSON.stringify(combined));
      setNotifications(combined);
    } else {
      setNotifications(JSON.parse(localStorage.getItem('lucy_notifications') || '[]'));
    }

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

  const filteredSales = sales.filter(s => {
    if (!s.productId) return false; // Filter out Tailoring/Customer objects leaked into global sales
    const afterFrom = fromDate ? s.date >= fromDate : true;
    const beforeTo = toDate ? s.date <= toDate : true;
    return afterFrom && beforeTo;
  });

  const totalEarnedRevenue = filteredSales.reduce((sum, s) => sum + (s.soldPrice || 0), 0);
  const totalCashCollected = filteredSales.reduce((sum, s) => sum + (s.cashCollected !== undefined ? s.cashCollected : (s.soldPrice || 0)), 0);
  const totalProfit = filteredSales.reduce((sum, s) => sum + (s.profit || 0), 0);
  const totalCost = stock.reduce((sum, s) => sum + (s.quantity || 0) * (s.buyingPrice || 0), 0);
  const stockValue = stock.reduce((sum, s) => sum + (s.quantity || 0) * (s.price || 0), 0);
  const salesCount = filteredSales.length;

  // Trend chart: group by date
  const salesByDate = filteredSales.reduce((acc, s) => {
    const d = s.date || 'Unknown Date';
    if (!acc[d]) acc[d] = { date: d, revenue: 0, profit: 0, collected: 0 };
    acc[d].revenue += s.soldPrice || 0;
    acc[d].profit += s.profit || 0;
    acc[d].collected += (s.cashCollected !== undefined ? s.cashCollected : (s.soldPrice || 0));
    return acc;
  }, {});
  const trendData = Object.values(salesByDate)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));

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

  // Tailoring Analytics State
  const totalPendingBalance = tailoringOrders.reduce((sum, o) => sum + (o.balance || 0), 0);

  const tailoringEarnedRevenue = tailoringOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const tailoringCashCollected = tailoringOrders.reduce((sum, o) => {
    const pSum = (o.payments || []).reduce((s, p) => s + (p.amount || 0), 0);
    return sum + Math.max(o.deposit || 0, pSum);
  }, 0);

  const tailoringByDate = tailoringOrders.reduce((acc, o) => {
    const d = o.date || (o.timestamp ? o.timestamp.split('T')[0] : 'Unknown Date');
    if (!acc[d]) acc[d] = { date: d, revenue: 0, collected: 0, pending: 0 };
    acc[d].revenue += o.amount || 0;
    
    const pSum = (o.payments || []).reduce((s, p) => s + (p.amount || 0), 0);
    acc[d].collected += Math.max(o.deposit || 0, pSum);
    acc[d].pending += o.balance || 0;
    return acc;
  }, {});
  const tailoringTrendData = Object.values(tailoringByDate).sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  const serviceRevenue = tailoringOrders.reduce((acc, o) => {
    const name = o.type || 'Unknown';
    acc[name] = (acc[name] || 0) + (o.amount || 0);
    return acc;
  }, {});
  const topServices = Object.entries(serviceRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, revenue]) => ({ name, revenue }));

  const tailoringCards = [
    { label: 'Tailoring Revenue', value: fmt(tailoringEarnedRevenue), icon: <Scissors size={40} />, bg: 'bg-indigo-500' },
    { label: 'Cash Collected', value: fmt(tailoringCashCollected), icon: <DollarSign size={40} />, bg: 'bg-emerald-500' },
    { label: 'Pending Balances', value: fmt(totalPendingBalance), icon: <ShoppingCart size={40} />, bg: 'bg-rose-500' },
    { label: 'Customers CRM', value: customers.length.toString(), icon: <Users size={40} />, bg: 'bg-[#8b5cf6]' }
  ];

  const topCards = [
    {
      label: 'Earned Revenue', value: fmt(totalEarnedRevenue),
      icon: <DollarSign size={40} />,
      bg: 'bg-[#3b82f6]', // Blue
    },
    {
      label: 'Cash Collected', value: fmt(totalCashCollected),
      icon: <DollarSign size={40} />,
      bg: 'bg-[#10b981]', // Green
    },
    {
      label: 'Stock Value', value: fmt(stockValue),
      icon: <Package size={40} />,
      bg: 'bg-[#8b5cf6]', // Purple
    },
    {
      label: 'Total Profit', value: fmt(totalProfit),
      icon: profitPositive ? <TrendingUp size={40} /> : <TrendingDown size={40} />,
      bg: 'bg-slate-900', // Dark
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" onClick={handleBackgroundClick}>
      
      {/* Top Header */}
      <header className="bg-white shadow-sm flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 sm:py-0 sm:h-16 sticky top-0 z-40 gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="p-1.5 sm:p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="h-9 sm:h-11 flex items-center justify-center shrink-0">
            <img src={logo} alt="Logo" className="h-full w-auto object-contain" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[17px] sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 tracking-tight leading-none">
              Nyakoe Fassions
            </h1>
            <p className="text-[9px] sm:text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mt-1">
              Admin Portal
            </p>
          </div>
        </div>
        
        {/* Right side controls */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
          {/* Date Picker */}
          <div className="flex items-center gap-1 sm:gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs shadow-inner flex-1 sm:flex-none justify-center">
            <Calendar size={14} className="text-slate-400 hidden sm:block" />
            <input
              type="date" value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none w-[90px] sm:w-[105px]"
            />
            <span className="text-slate-300">-</span>
            <input
              type="date" value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none w-[90px] sm:w-[105px]"
            />
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-1.5 sm:p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white shadow ring-2 ring-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              {isNotifOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs font-medium">
                        You're all caught up!
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-4 transition-colors hover:bg-slate-50 flex items-start gap-3 ${!n.isRead ? 'bg-blue-50/30' : ''}`}>
                          <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!n.isRead ? 'bg-blue-500 animate-pulse' : 'bg-slate-200'}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs ${!n.isRead ? 'font-bold text-slate-800' : 'font-semibold text-slate-600'}`}>{n.title}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug truncate">{n.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleRefresh}
              title="Refresh"
              className="p-1.5 sm:p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin text-blue-600" : ""} />
            </button>
            
            <div className="hidden sm:block h-8 w-px bg-slate-200 mx-1" />
            
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-700 leading-tight">Admin User</p>
              <p className="text-[10px] font-bold text-emerald-500 flex items-center justify-end gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                ONLINE
              </p>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center text-sm font-black shadow-sm shrink-0">
              A
            </div>
            
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 sm:p-2 text-rose-500 hover:text-white transition-colors rounded-lg hover:bg-rose-500 bg-rose-50 border border-rose-100"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-56 mt-2 ml-4 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 py-2 animate-in fade-in slide-in-from-top-2">
            <div className="px-4 py-2 border-b border-slate-50 mb-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quick Links</p>
            </div>
            {quickLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-between"
              >
                {link.label}
              </button>
            ))}
            
            <div className="border-t border-slate-100 mt-1 mb-1"></div>
            
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors flex items-center gap-2"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        )}
      </header>

      {/* Dashboard Content */}
        <main className="flex-1 px-4 sm:px-8 py-4 sm:py-6 w-full flex flex-col min-h-0">
          
          {/* Top Cards */}
          <div id="overview" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6 shrink-0 scroll-mt-24">
            {topCards.map((card, i) => (
              <div key={i} className={`${card.bg} rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between h-24 sm:h-32 transform transition-transform hover:-translate-y-1`}>
                <div className="relative z-10">
                  <h3 className="text-lg sm:text-3xl font-black mb-0.5 sm:mb-1 drop-shadow-sm leading-tight">{card.value}</h3>
                  <p className="text-[10px] sm:text-sm font-medium opacity-90">{card.label}</p>
                </div>
                <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 opacity-20 scale-75 sm:scale-100 origin-right">
                  {card.icon}
                </div>
                <div className="absolute -right-4 -top-8 w-24 h-24 sm:w-32 sm:h-32 bg-white opacity-10 rounded-full blur-2xl" />
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6 shrink-0">
            
            {/* Profit & Loss Trend */}
            <div id="profit-loss" className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 scroll-mt-24">
              <h3 className="text-sm font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2">
                <BarChart2 size={18} className="text-blue-500" />
                Profit & Loss Trend
              </h3>
              {trendData.length === 0 ? (
                <div className="h-[200px] sm:h-[280px] flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No data in this date range
                </div>
              ) : (
                <div className="h-[200px] sm:h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData.map(d => ({ ...d, profit: d.profit, loss: d.revenue - d.profit }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" tickFormatter={(val) => typeof val === 'string' && val.length >= 10 ? val.slice(5) : val} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} dx={-10} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                      <Tooltip 
                        {...tooltipStyle} 
                        labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}
                        labelFormatter={(label) => {
                          const d = new Date(label);
                          return isNaN(d.getTime()) ? label : d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
                        }}
                        formatter={(v, name) => [`KSh ${v.toLocaleString()}`, name]} 
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 500, paddingTop: '10px' }} />
                      <Line type="monotone" dataKey="revenue" name="Earned" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="collected" name="Collected" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="profit" name="Profit" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Top Products (Pie Chart) */}
            <div id="top-products" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 scroll-mt-24">
              <h3 className="text-sm font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2">
                <PieChartIcon size={18} className="text-emerald-500" />
                Top Products by Revenue
              </h3>
              {topProducts.length === 0 ? (
                <div className="h-[200px] sm:h-[280px] flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No data
                </div>
              ) : (
                <div className="h-[200px] sm:h-[280px] relative">
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
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 flex-1 min-h-0 pb-4">
            
            {/* Recent Sales Table */}
            <div id="recent-sales" className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden min-h-[300px] scroll-mt-24">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between shrink-0 gap-3">
                <h3 className="text-sm font-bold text-slate-800">Recent Sales</h3>
                <div className="relative w-full sm:w-auto">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search sales..."
                    value={salesSearch}
                    onChange={(e) => setSalesSearch(e.target.value)}
                    onBlur={() => setSalesSearch('')}
                    className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm w-full sm:w-48 transition-all"
                  />
                </div>
              </div>
              {recentSales.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-sm flex-1">No sales in this date range</div>
              ) : (
                <div ref={salesScrollRef} className="flex-1 overflow-auto p-2">
                  <table className="w-full text-left border-collapse min-w-[360px]">
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
            <div id="current-stock" className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden min-h-[300px] scroll-mt-24">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between shrink-0 gap-3">
                <h3 className="text-sm font-bold text-slate-800">Current Stock</h3>
                <div className="relative w-full sm:w-auto">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search stock..."
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    onBlur={() => setStockSearch('')}
                    className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm w-full sm:w-48 transition-all"
                  />
                </div>
              </div>
              {stock.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-sm flex-1">No stock added yet</div>
              ) : (
                <div ref={stockScrollRef} className="flex-1 overflow-auto p-2">
                  <table className="w-full text-left border-collapse min-w-[360px]">
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


          {/* ========================================================= */}
          {/*                 TAILORING & CUSTOMERS                     */}
          {/* ========================================================= */}
          
          <div id="tailoring" className="mt-10 mb-6 flex items-center justify-center gap-4 scroll-mt-24">
            <div className="h-[1px] flex-1 bg-slate-200"></div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
              <Scissors size={16} className="text-indigo-500" />
              Tailoring & Customers
            </h2>
            <div className="h-[1px] flex-1 bg-slate-200"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6 shrink-0 scroll-mt-24">
            {tailoringCards.map((card, i) => (
              <div key={i} className={`${card.bg} rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between h-24 sm:h-32 transform transition-transform hover:-translate-y-1`}>
                <div className="relative z-10">
                  <h3 className="text-lg sm:text-3xl font-black mb-0.5 sm:mb-1 drop-shadow-sm leading-tight">{card.value}</h3>
                  <p className="text-[10px] sm:text-sm font-medium opacity-90">{card.label}</p>
                </div>
                <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 opacity-20 scale-75 sm:scale-100 origin-right">
                  {card.icon}
                </div>
                <div className="absolute -right-4 -top-8 w-24 h-24 sm:w-32 sm:h-32 bg-white opacity-10 rounded-full blur-2xl" />
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6 shrink-0">
            {/* Tailoring Trend */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2">
                <BarChart2 size={18} className="text-indigo-500" />
                Tailoring Revenue Trend
              </h3>
              {tailoringTrendData.length === 0 ? (
                <div className="h-[200px] sm:h-[280px] flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No data in this date range
                </div>
              ) : (
                <div className="h-[200px] sm:h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={tailoringTrendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" tickFormatter={(val) => typeof val === 'string' && val.length >= 10 ? val.slice(5) : val} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} dx={-10} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                      <Tooltip 
                        {...tooltipStyle} 
                        labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}
                        formatter={(v, name) => [`KSh ${v.toLocaleString()}`, name]} 
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 500, paddingTop: '10px' }} />
                      <Line type="monotone" dataKey="revenue" name="Billed Revenue" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="collected" name="Cash Collected" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="pending" name="Pending Balances" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Top Services */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2">
                <PieChartIcon size={18} className="text-emerald-500" />
                Top Services by Revenue
              </h3>
              {topServices.length === 0 ? (
                <div className="h-[200px] sm:h-[280px] flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No data
                </div>
              ) : (
                <div className="h-[200px] sm:h-[280px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topServices}
                        cx="50%" cy="45%"
                        innerRadius={60} outerRadius={85}
                        paddingAngle={5}
                        dataKey="revenue"
                        nameKey="name"
                      >
                        {topServices.map((entry, index) => (
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

          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 flex-1 min-h-0 pb-4">
            {/* Recent Tailoring Orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden min-h-[300px]">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                <h3 className="text-sm font-bold text-slate-800">Recent Tailoring Orders</h3>
              </div>
              {tailoringOrders.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-sm flex-1">No orders yet</div>
              ) : (
                <div className="flex-1 overflow-auto p-2">
                  <table className="w-full text-left border-collapse min-w-[360px]">
                    <thead>
                      <tr>
                        <th className="pl-4 pr-2 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0 w-8">#</th>
                        <th className="px-2 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0">Client & Service</th>
                        <th className="px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0 text-right">Value</th>
                        <th className="px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tailoringOrders.slice(0, 30).map((order, i) => (
                        <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="pl-4 pr-2 py-1.5">
                            <span className="text-[10px] font-black text-slate-300">{(i + 1).toString().padStart(2, '0')}</span>
                          </td>
                          <td className="px-2 py-1.5">
                            <p className="text-[13px] font-semibold text-slate-700 truncate max-w-[160px] leading-tight">{order.customer}</p>
                            <p className="text-[9px] font-medium text-slate-400 mt-0.5 tracking-wide">{order.type} • {order.timestamp ? new Date(order.timestamp).toLocaleDateString() : 'N/A'}</p>
                          </td>
                          <td className="px-4 py-1.5 text-right">
                            <p className="text-[12px] font-bold text-slate-800">KSh {(order.amount || 0).toLocaleString()}</p>
                          </td>
                          <td className="px-4 py-1.5 text-right">
                            {order.balance > 0 ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-600">
                                KSh {order.balance.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600">
                                CLEARED
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Customers Table (Pre-existing) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden min-h-[300px]">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between shrink-0 gap-3">
                <h3 className="text-sm font-bold text-slate-800">Top Customers (CRM)</h3>
              </div>
              {customers.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-sm flex-1">No customers yet</div>
              ) : (
                <div className="flex-1 overflow-auto p-2">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr>
                        <th className="pl-4 pr-2 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0 w-8">#</th>
                        <th className="px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0">Client Details</th>
                        <th className="px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0">Contact</th>
                        <th className="px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0">Last Visit</th>
                        <th className="px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-400 bg-white sticky top-0 text-right">LTV (Spent)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customers.slice(0, 30).map((c, i) => (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="pl-4 pr-2 py-2">
                            <span className="text-[10px] font-black text-slate-300">{(i + 1).toString().padStart(2, '0')}</span>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                                {c.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-[13px] font-bold text-slate-800">{c.name}</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{c.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <p className="text-[12px] font-medium text-slate-600">{c.phone}</p>
                          </td>
                          <td className="px-4 py-2">
                            <p className="text-[12px] font-medium text-slate-600">{c.lastOrder !== '-' && c.lastOrder ? new Date(c.lastOrder).toLocaleDateString() : 'N/A'}</p>
                          </td>
                          <td className="px-4 py-2 text-right">
                            <p className="text-[13px] font-black text-slate-900">KSh {(c.totalSpent || 0).toLocaleString()}</p>
                          </td>
                        </tr>
                      ))}
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

import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, ArrowLeft, Clock, Calendar, DollarSign, Tag, Search, TrendingDown, Percent, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OutflowPage = () => {
  const navigate = useNavigate();
  const [stock, setStock] = useState([]);
  const [sales, setSales] = useState([]);
  
  // Form State
  const getDraft = () => {
    const draft = localStorage.getItem('lucy_draft_outflow');
    if (draft) {
      try { return JSON.parse(draft); } catch(e) {}
    }
    return null;
  };
  const draft = getDraft();

  const [selectedProductId, setSelectedProductId] = useState(draft?.selectedProductId || '');
  const [searchQuery, setSearchQuery] = useState(draft?.searchQuery || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [soldPrice, setSoldPrice] = useState(draft?.soldPrice || '');
  const [listSearchQuery, setListSearchQuery] = useState('');
  const [date, setDate] = useState(draft?.date || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(draft?.time || new Date().toLocaleTimeString('en-US', { hour12: false }).substring(0, 5));

  // Persist draft to local storage
  useEffect(() => {
    const draftState = { selectedProductId, searchQuery, soldPrice, date, time };
    localStorage.setItem('lucy_draft_outflow', JSON.stringify(draftState));
  }, [selectedProductId, searchQuery, soldPrice, date, time]);

  // Derived state
  const selectedProduct = stock.find(item => item.id === selectedProductId);
  const discount = selectedProduct && soldPrice ? (selectedProduct.price - parseFloat(soldPrice)) : 0;
  const profit = selectedProduct && soldPrice ? (parseFloat(soldPrice) - (selectedProduct.buyingPrice || 0)) : 0;

  const availableStock = stock.filter(item => item.quantity > 0);
  const filteredStock = availableStock.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Load data on mount
  useEffect(() => {
    const savedStock = localStorage.getItem('lucy_stock');
    const savedSales = localStorage.getItem('lucy_sales');
    if (savedStock) setStock(JSON.parse(savedStock));
    if (savedSales) {
      const parsedSales = JSON.parse(savedSales);
      // Clean up any accidentally leaked Tailoring orders
      setSales(parsedSales.filter(s => s.productId));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct || !soldPrice) return;

    // Create sale record
    const newSale = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      name: selectedProduct.name,
      originalPrice: selectedProduct.price,
      buyingPrice: selectedProduct.buyingPrice || 0,
      soldPrice: parseFloat(soldPrice),
      discount: discount,
      profit: profit,
      date: date,
      time: time,
      timestamp: new Date(`${date}T${time}`).toISOString()
    };

    // Update sales history
    const updatedSales = [newSale, ...sales];
    setSales(updatedSales);
    localStorage.setItem('lucy_sales', JSON.stringify(updatedSales));

    // Deduct stock
    const updatedStock = stock.map(item => {
      if (item.id === selectedProduct.id) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setStock(updatedStock);
    localStorage.setItem('lucy_stock', JSON.stringify(updatedStock));

    // Reset form fields
    setSelectedProductId('');
    setSearchQuery('');
    setSoldPrice('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime(new Date().toLocaleTimeString('en-US', { hour12: false }).substring(0, 5));
    localStorage.removeItem('lucy_draft_outflow');
  };

  // --- Graph Aggregation Logic ---
  const { weeklyData, dailyData } = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // 1. Weekly Data (Last 7 Days)
    const weekMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const shortDay = d.toLocaleDateString('en-US', { weekday: 'short' });
      weekMap[dStr] = { label: shortDay, date: dStr, profit: 0 };
    }

    // 2. Daily Data (Today, by Hour)
    const dayMap = {};
    for (let i = 8; i <= 20; i++) {
      const hr = i.toString().padStart(2, '0') + ':00';
      dayMap[hr] = { label: hr, profit: 0 };
    }

    sales.forEach(s => {
      // Weekly Profit
      if (s.date && weekMap[s.date]) {
        weekMap[s.date].profit += (s.profit || 0);
      }
      
      // Daily Profit (only today)
      if (s.date === todayStr && s.time) {
        const hour = s.time.substring(0, 2) + ':00'; // group by hour
        if (dayMap[hour]) {
          dayMap[hour].profit += (s.profit || 0);
        } else {
          // If out of 8-20 range, create it
          dayMap[hour] = { label: hour, profit: (s.profit || 0) };
        }
      }
    });

    return {
      weeklyData: Object.values(weekMap),
      dailyData: Object.values(dayMap).sort((a, b) => a.label.localeCompare(b.label))
    };
  }, [sales]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-900 pb-20">
      {/* Premium Header */}
      <header className="bg-white border-b border-violet-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="p-2 -ml-2 text-violet-500 hover:bg-violet-50 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight">LUCY Collections</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-violet-500">Outflows & Sales</p>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 py-8 flex flex-col xl:grid xl:grid-cols-4 gap-6 items-start">
        
        {/* LEFT GRAPH: Weekly Profit */}
        <div className="order-2 xl:order-1 xl:col-span-1 w-full bg-white rounded-sm p-5 shadow-sm border border-violet-100 xl:sticky xl:top-24">
          <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2"><Calendar size={14} className="text-violet-500" /> Weekly Profit</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} dx={-10} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} width={35} />
                <Tooltip 
                  cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value) => [`KSh ${value.toLocaleString()}`, 'Profit']}
                />
                <Line type="monotone" dataKey="profit" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CENTER CONTENT */}
        <div className="order-1 xl:order-2 xl:col-span-2 w-full max-w-2xl mx-auto">
          {/* Sale Entry Form Card */}
          <section className="bg-white rounded-sm p-6 shadow-[0_8px_30px_rgba(139,92,246,0.06)] border border-violet-50/50 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-violet-100 text-violet-600 rounded-sm">
              <ShoppingCart size={24} />
            </div>
            <h2 className="text-lg font-black uppercase tracking-wide">Record a Sale</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative z-30">
              <label className="block text-[10px] uppercase tracking-[0.1em] font-bold text-slate-500 mb-2">Search & Select Product</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Search size={16} />
                </div>
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedProductId('');
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-sm pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
                  placeholder="Type to search in stock..."
                  required={!selectedProductId}
                />
                
                {/* Search Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.08)] max-h-60 overflow-y-auto">
                    {filteredStock.length > 0 ? (
                      <ul className="py-2">
                        {filteredStock.map(item => (
                          <li 
                            key={item.id}
                            onMouseDown={() => {
                              setSelectedProductId(item.id);
                              setSearchQuery(item.name);
                              setIsDropdownOpen(false);
                            }}
                            className="px-4 py-3 hover:bg-violet-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0 flex justify-between items-center"
                          >
                            <span className="font-bold text-slate-700 truncate pr-4">{item.name}</span>
                            <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-md whitespace-nowrap">{item.quantity} in stock</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-4 py-6 text-center text-sm font-medium text-slate-500">
                        No matching products found.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {selectedProduct && (
              <div className="bg-slate-50 p-4 rounded-sm border border-slate-200">
                <div className="mb-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-violet-500 font-black mb-1">Selected Item</p>
                  <h3 className="text-base font-black text-slate-900">{selectedProduct.name}</h3>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200/60 pt-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Tag Price</p>
                    <p className="text-lg font-black text-slate-800">Ksh {selectedProduct.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Available</p>
                    <p className="text-sm font-bold text-slate-700">{selectedProduct.quantity} pieces</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.1em] font-bold text-slate-500 mb-2">Sold Price</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <span className="font-bold text-[11px]">Ksh</span>
                  </div>
                  <input 
                    type="number" 
                    value={soldPrice}
                    onChange={(e) => setSoldPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-sm pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    disabled={!selectedProduct}
                  />
                </div>
              </div>
              
              {/* Auto-Calculated Profit */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.1em] font-bold text-slate-500 mb-2">Profit</label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${profit > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                    <span className="font-bold text-[11px]">Ksh</span>
                  </div>
                  <input 
                    type="text" 
                    value={selectedProduct && soldPrice ? profit.toLocaleString() : '—'}
                    className={`w-full bg-white border ${profit > 0 ? 'border-emerald-200 text-emerald-600 bg-emerald-50/30' : 'border-slate-200 text-slate-500'} rounded-sm pl-12 pr-4 py-3.5 text-sm font-bold transition-all`}
                    disabled
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.1em] font-bold text-slate-500 mb-2">Date Sold</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Calendar size={16} />
                  </div>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-sm pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.1em] font-bold text-slate-500 mb-2">Time Recorded</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Clock size={16} />
                  </div>
                  <input 
                    type="time" 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-sm pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={!selectedProduct}
              className="w-full mt-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-[0.2em] py-4 rounded-sm shadow-[0_8px_20px_rgba(168,85,247,0.3)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.5)] transition-all active:scale-[0.98]"
            >
              Complete Sale
            </button>
          </form>
        </section>

        {/* Recent Sales List */}
        <div>
          <div className="mb-6 flex flex-col items-center gap-4">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 flex items-center justify-center gap-2 text-center w-full">
              <TrendingDown size={18} className="text-violet-500" /> Recent Sales ({sales.length})
            </h3>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search size={16} />
              </div>
              <input 
                type="text" 
                value={listSearchQuery}
                onChange={(e) => setListSearchQuery(e.target.value)}
                placeholder="Search sales by name, date..."
                className="w-full bg-white border border-slate-200 rounded-sm pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all shadow-sm"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            {sales.filter(sale => (sale.name || sale.productName || '').toLowerCase().includes(listSearchQuery.toLowerCase()) || (sale.date || '').includes(listSearchQuery)).length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-sm border border-dashed border-slate-200">
                <p className="text-sm text-slate-500 font-medium">No matching sales found.</p>
              </div>
            ) : (
              sales.filter(sale => (sale.name || sale.productName || '').toLowerCase().includes(listSearchQuery.toLowerCase()) || (sale.date || '').includes(listSearchQuery)).map((sale, index) => (
                <div key={sale.id} className="bg-white p-5 rounded-sm shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="bg-violet-50 text-violet-600 font-black text-[10px] px-2 py-1 rounded-sm">#{index + 1}</span>
                      <h4 className="font-bold text-slate-900">{sale.name || sale.productName}</h4>
                    </div>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">1 pc</span>
                      {sale.profit > 0 ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                          Profit: Ksh {sale.profit.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-1 rounded">
                          Loss: Ksh {Math.abs(sale.profit).toLocaleString()}
                        </span>
                      )}
                      {sale.discount > 0 && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                          Discount Given: Ksh {sale.discount.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between">
                    <span className="font-black text-violet-600 text-lg">Ksh {sale.soldPrice.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{sale.date} • {sale.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

          </div>

        {/* RIGHT GRAPH: Daily Profit */}
        <div className="order-3 xl:order-3 xl:col-span-1 w-full bg-white rounded-sm p-5 shadow-sm border border-emerald-100 xl:sticky xl:top-24">
          <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2"><Clock size={14} className="text-emerald-500" /> Today's Profit</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} dx={-10} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} width={35} />
                <Tooltip 
                  cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value) => [`KSh ${value.toLocaleString()}`, 'Profit']}
                />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </main>
    </div>
  );
};

export default OutflowPage;

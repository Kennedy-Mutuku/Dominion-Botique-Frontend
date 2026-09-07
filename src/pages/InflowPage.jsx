import React, { useState, useEffect } from 'react';
import { PackagePlus, ArrowLeft, Clock, Calendar, DollarSign, Package, TrendingUp, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InflowPage = () => {
  const navigate = useNavigate();
  const [stock, setStock] = useState([]);
  const [listSearchQuery, setListSearchQuery] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    buyingPrice: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour12: false }).substring(0, 5)
  });

  // Load stock on mount
  useEffect(() => {
    const savedStock = localStorage.getItem('lucy_stock');
    if (savedStock) {
      setStock(JSON.parse(savedStock));
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.price) return;

    const newItem = {
      id: Date.now().toString(),
      name: formData.name,
      quantity: parseInt(formData.quantity, 10),
      buyingPrice: parseFloat(formData.buyingPrice),
      price: parseFloat(formData.price),
      date: formData.date,
      time: formData.time,
      timestamp: new Date(`${formData.date}T${formData.time}`).toISOString()
    };

    const updatedStock = [newItem, ...stock];
    setStock(updatedStock);
    localStorage.setItem('lucy_stock', JSON.stringify(updatedStock));

    // Reset form but keep date/time current
    setFormData({
      name: '',
      quantity: '',
      buyingPrice: '',
      price: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false }).substring(0, 5)
    });
  };

  const totalWorth = stock.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const totalCost = stock.reduce((sum, item) => sum + (item.quantity * (item.buyingPrice || 0)), 0);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-900 pb-20">
      {/* Premium Header */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="p-2 -ml-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight">LUCY Collections</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-rose-500">Inflows & Stock Entry</p>
          </div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Entry Form Card */}
        <section className="bg-white rounded-sm p-6 shadow-sm border border-rose-100 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-sm">
              <PackagePlus size={24} />
            </div>
            <h2 className="text-lg font-black uppercase tracking-wide">Record New Stock</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.1em] font-bold text-slate-500 mb-2">Product Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-3.5 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all"
                placeholder="e.g. men shirts"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-6">
                <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Quantity (How Many)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Package size={16} />
                  </div>
                  <input 
                    type="number" 
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-sm pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all"
                    placeholder="0"
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.1em] font-bold text-slate-500 mb-2">Buying Price (Cost)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <span className="font-bold text-[11px]">Ksh</span>
                  </div>
                  <input 
                    type="number" 
                    name="buyingPrice"
                    value={formData.buyingPrice}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-sm pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.1em] font-bold text-slate-500 mb-2">Selling Price (Tag)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <span className="font-bold text-[11px]">Ksh</span>
                  </div>
                  <input 
                    type="number" 
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-sm pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.1em] font-bold text-slate-500 mb-2">Date Received</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Calendar size={16} />
                  </div>
                  <input 
                    type="date" 
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-sm pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all"
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
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-sm pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full mt-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black uppercase tracking-[0.2em] py-4 rounded-sm shadow-[0_8px_20px_rgba(244,63,94,0.3)] hover:shadow-[0_8px_30px_rgba(244,63,94,0.5)] transition-all active:scale-[0.98]"
            >
              Add to Inventory
            </button>
          </form>
        </section>

        {/* Dashboard / Summary Card */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-900 rounded-sm p-6 text-white shadow-sm border border-slate-800">
            <div className="flex items-center gap-3 opacity-80 mb-2">
              <TrendingUp size={18} />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Expected Revenue</h3>
            </div>
            <p className="text-xl md:text-3xl font-black tracking-tight">
              Ksh {totalWorth.toLocaleString()}
            </p>
          </div>
          <div className="bg-rose-600 rounded-sm p-6 text-white shadow-sm border border-rose-700">
            <div className="flex items-center gap-3 opacity-90 mb-2">
              <span className="font-bold text-[14px]">Ksh</span>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Total Cost</h3>
            </div>
            <p className="text-xl md:text-3xl font-black tracking-tight">
              Ksh {totalCost.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Stock List */}
        <div>
          <div className="mb-6 flex flex-col items-center gap-4">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 flex items-center justify-center gap-2 text-center w-full">
              <Package size={18} className="text-rose-500" /> Current Stock ({stock.length})
            </h3>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search size={16} />
              </div>
              <input 
                type="text" 
                value={listSearchQuery}
                onChange={(e) => setListSearchQuery(e.target.value)}
                placeholder="Search stock by name, date..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all shadow-sm"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            {stock.filter(item => item.name.toLowerCase().includes(listSearchQuery.toLowerCase()) || item.date.includes(listSearchQuery)).length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-sm border border-slate-200">
                <p className="text-sm text-slate-500 font-medium">No matching stock found.</p>
              </div>
            ) : (
              stock.filter(item => item.name.toLowerCase().includes(listSearchQuery.toLowerCase()) || item.date.includes(listSearchQuery)).map((item, index) => (
                <div key={item.id} className="bg-white p-5 rounded-sm shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="bg-rose-50 text-rose-600 font-black text-[10px] px-2 py-1 rounded-sm">#{index + 1}</span>
                      <h4 className="font-bold text-slate-900">{item.name}</h4>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1"><Package size={12}/> {item.quantity} pcs</span>
                      <span className="flex items-center gap-1 font-bold text-slate-700">Cost: Ksh {(item.buyingPrice || 0).toLocaleString()}</span>
                      <span className="flex items-center gap-1 text-emerald-600">Tag: Ksh {item.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between">
                    <span className="font-black text-rose-600 text-lg">Ksh {(item.quantity * item.price).toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{item.date} • {item.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default InflowPage;

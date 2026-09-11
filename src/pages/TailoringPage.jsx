import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scissors, Plus, Search, ChevronRight, User, Phone, Calendar, Layers, ArrowLeft, X, Ruler, CreditCard, Banknote
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TailoringPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [formErrors, setFormErrors] = useState({});

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');

  const defaultDraft = { 
    customer: '', phone: '', isTailoring: true, 
    type: '', fabricType: '', notes: '', amount: '', deposit: '', dueDate: new Date().toISOString().split('T')[0],
    chest: '', waist: '', shoulder: '', sleeve: '', neck: '', length: '', hip: '', thigh: '',
    customMeasureName: '', customMeasureValue: '',
    materialCost: '', laborCost: ''
  };

  const getDraft = () => {
    const draft = localStorage.getItem('lucy_draft_tailoring');
    if (draft) {
      try { return JSON.parse(draft); } catch(e) {}
    }
    return defaultDraft;
  };

  const [formData, setFormData] = useState(getDraft());

  useEffect(() => {
    localStorage.setItem('lucy_draft_tailoring', JSON.stringify(formData));
  }, [formData]);

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('lucy_tailoring_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('lucy_customers');
    return saved ? JSON.parse(saved) : [];
  });

  // Auto-complete logic
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const suggestionsRef = useRef(null);

  const activeSuggestions = customers.filter(c => {
    const val = activeField === 'customer' ? formData.customer : formData.phone;
    if (!val || val.length < 2) return false;
    return c[activeField === 'customer' ? 'name' : 'phone'].toLowerCase().includes(val.toLowerCase());
  }).slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (c) => {
    setFormData(prev => ({
      ...prev,
      customer: c.name,
      phone: c.phone,
      ...c.measurements
    }));
    setShowSuggestions(false);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'ready': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]';
      case 'in-progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]';
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]';
      default: return 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || order.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleCreateOrder = () => {
    let errors = {};
    if (!formData.customer.trim()) errors.customer = "Required";
    if (!formData.phone.trim()) {
      errors.phone = "Required";
    } else if (formData.phone.replace(/[^\d]/g, '').length < 9) {
      errors.phone = "Invalid format";
    }
    if (formData.isTailoring && !formData.type.trim()) errors.type = "Required";
    if (!formData.amount || parseFloat(formData.amount) <= 0) errors.amount = "Required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    
    const amountNum = parseFloat(formData.amount || 0);
    const depositNum = parseFloat(formData.deposit || 0);
    const materialNum = parseFloat(formData.materialCost || 0);
    const laborNum = parseFloat(formData.laborCost || 0);
    const balanceNum = Math.max(0, amountNum - depositNum);
    const orderId = `ORD-${Date.now().toString().slice(-4)}`;
    
    // If Tailoring, save to Tailoring Orders
    let updatedOrders = [...orders];
    if (formData.isTailoring) {
      const newOrder = {
        id: orderId,
        status: 'Pending',
        ...formData,
        amount: amountNum,
        deposit: depositNum,
        balance: balanceNum,
        materialCost: materialNum,
        laborCost: laborNum,
        timestamp: new Date().toISOString(),
        payments: depositNum > 0 ? [{ amount: depositNum, date: new Date().toISOString(), note: 'Initial Deposit' }] : []
      };
      updatedOrders = [newOrder, ...orders];
      setOrders(updatedOrders);
      localStorage.setItem('lucy_tailoring_orders', JSON.stringify(updatedOrders));
    }

    // Auto-Sync to Customers CRM
    const existingIndex = customers.findIndex(c => c.phone === formData.phone || c.name.toLowerCase() === formData.customer.toLowerCase());
    
    const newMeasurements = formData.isTailoring ? {
      chest: formData.chest, waist: formData.waist, shoulder: formData.shoulder, sleeve: formData.sleeve,
      neck: formData.neck, length: formData.length, hip: formData.hip, thigh: formData.thigh,
      [formData.customMeasureName]: formData.customMeasureValue
    } : {};

    const purchaseLog = {
      id: orderId,
      item: formData.type,
      amount: amountNum,
      deposit: depositNum,
      balance: formData.isTailoring ? (amountNum - depositNum) : 0,
      date: new Date().toISOString(),
      isTailoring: formData.isTailoring,
      notes: formData.notes,
      measurements: newMeasurements,
      payments: formData.isTailoring && depositNum > 0 ? [{ amount: depositNum, date: new Date().toISOString(), note: 'Initial Deposit' }] : []
    };

    let updatedCustomers = [...customers];

    if (existingIndex >= 0) {
      const c = updatedCustomers[existingIndex];
      updatedCustomers.splice(existingIndex, 1);
      updatedCustomers.unshift({
        ...c,
        totalSpent: (c.totalSpent || 0) + amountNum,
        lastOrder: new Date().toISOString(),
        history: [purchaseLog, ...(c.history || [])],
        measurements: formData.isTailoring ? { ...c.measurements, ...newMeasurements } : c.measurements
      });
    } else {
      updatedCustomers.unshift({
        id: `CUST-${Date.now().toString().slice(-4)}`,
        name: formData.customer,
        phone: formData.phone,
        email: '',
        lastOrder: new Date().toISOString(),
        totalSpent: amountNum,
        history: [purchaseLog],
        measurements: newMeasurements
      });
    }
    
    setCustomers(updatedCustomers);
    localStorage.setItem('lucy_customers', JSON.stringify(updatedCustomers));
    
    setFormData(defaultDraft);
    localStorage.removeItem('lucy_draft_tailoring');
    setShowModal(false);
  };

  const handleRecordPayment = () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) return;
    
    const amt = parseFloat(paymentAmount);
    
    // Update Order
    const updatedOrders = orders.map(o => {
      if (o.id === selectedOrder.id) {
        return {
          ...o,
          deposit: o.deposit + amt,
          balance: Math.max(0, o.balance - amt),
          payments: [{ amount: amt, date: new Date().toISOString(), note: paymentNote || 'Partial Payment' }, ...(o.payments || [])]
        };
      }
      return o;
    });
    
    setOrders(updatedOrders);
    localStorage.setItem('lucy_tailoring_orders', JSON.stringify(updatedOrders));

    // Update Customer History Balance
    const updatedCustomers = customers.map(c => {
      if (c.phone === selectedOrder.phone) {
        const updatedHistory = (c.history || []).map(h => {
          if (h.id === selectedOrder.id) {
            return {
              ...h,
              deposit: (h.deposit || 0) + amt,
              balance: Math.max(0, (h.balance || 0) - amt)
            };
          }
          return h;
        });
        return { ...c, history: updatedHistory };
      }
      return c;
    });
    setCustomers(updatedCustomers);
    localStorage.setItem('lucy_customers', JSON.stringify(updatedCustomers));

    // Add to Global Sales as Cash Collected
    const sales = JSON.parse(localStorage.getItem('lucy_sales') || '[]');
    const paymentSale = {
      id: `PAY-${Date.now().toString().slice(-4)}`,
      productName: `Payment for ${selectedOrder.id}`,
      soldPrice: 0, // No new revenue built
      cashCollected: amt, // Only cash collected
      profit: 0,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' })
    };
    localStorage.setItem('lucy_sales', JSON.stringify([paymentSale, ...sales]));

    setSelectedOrder(updatedOrders.find(o => o.id === selectedOrder.id));
    setPaymentAmount('');
    setPaymentNote('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const tabs = ['All', 'Pending', 'In-Progress', 'Ready'];

  return (
    <div className="bg-[#09090b] min-h-screen relative overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200 font-sans text-zinc-300">
      <Header />
      <Sidebar />
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      
      <main className="w-full p-4 md:p-8 pt-56 lg:pt-48 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Section */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10"
          >
            <div className="flex items-center gap-5">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="p-3.5 text-zinc-400 hover:text-zinc-100 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 hover:bg-zinc-800 rounded-2xl transition-all shadow-lg shrink-0"
              >
                <ArrowLeft size={20} strokeWidth={2.5} />
              </motion.button>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight flex items-center gap-3">
                  Tailoring
                </h1>
                <p className="text-zinc-500 font-medium mt-1 text-sm tracking-wide">Manage bespoke orders, balances, and professional customer relationships.</p>
              </div>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(245, 158, 11, 0.2)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(true)}
              className="px-7 py-3.5 bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 bg-[length:200%_auto] hover:bg-[position:right_center] text-zinc-950 rounded-[1.25rem] font-black uppercase tracking-[0.1em] text-xs flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(245,158,11,0.2)] transition-all duration-500"
            >
              <Plus size={18} className="stroke-[3]" />
              <span>New Draft</span>
            </motion.button>
          </motion.header>

          {/* Unified Dock (Search & Filters) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-zinc-900/40 backdrop-blur-2xl p-2 rounded-full border border-zinc-800/80 shadow-[0_8px_30px_rgb(0,0,0,0.5)] mb-10 flex flex-col md:flex-row gap-2 relative z-10"
          >
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-amber-500 transition-colors duration-300" size={18} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search customers or order ID..."
                className="w-full pl-12 pr-5 py-3.5 bg-transparent border-none focus:ring-0 text-sm font-medium text-white placeholder-zinc-600 outline-none"
              />
            </div>
            
            <div className="w-px bg-zinc-800 my-2 hidden md:block" />
            
            <div className="flex gap-1 p-1 bg-zinc-950/50 rounded-full overflow-x-auto hide-scrollbar">
              {tabs.map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-6 py-2.5 rounded-full font-bold text-xs transition-all whitespace-nowrap z-10 ${
                    activeTab === tab ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeDockTab"
                      className="absolute inset-0 bg-zinc-800/80 shadow-lg border border-zinc-700/50 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {tab}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content Area */}
          {filteredOrders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900/20 backdrop-blur-xl p-20 rounded-[3rem] border border-zinc-800/50 flex flex-col items-center justify-center text-center mt-4 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
              
              <motion.div 
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="w-28 h-28 bg-zinc-950/80 border border-zinc-800 rounded-full flex items-center justify-center text-amber-500/80 mb-8 shadow-[0_0_50px_rgba(245,158,11,0.1)] backdrop-blur-sm"
              >
                <Scissors size={40} strokeWidth={1} />
              </motion.div>
              
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">The canvas is blank</h3>
              <p className="text-zinc-500 font-medium max-w-sm text-sm leading-relaxed">No bespoke orders matching your criteria. Adjust your filters or draft a new piece.</p>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredOrders.map((order) => (
                <motion.div 
                  key={order.id} 
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.2 } }}
                  className="bg-zinc-900/40 backdrop-blur-lg rounded-[1.5rem] border border-zinc-800/80 hover:border-zinc-700 shadow-xl transition-all group overflow-hidden relative flex flex-col cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className={`absolute top-0 left-0 w-full h-[2px] ${
                    order.status === 'Ready' ? 'bg-emerald-500' : 
                    order.status === 'In-Progress' ? 'bg-blue-500' : 'bg-amber-500'
                  }`} />

                  <div className="p-5 pb-3 flex justify-between items-center border-b border-zinc-800/50">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{order.id}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border backdrop-blur-md ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-11 h-11 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 shrink-0">
                        <User size={18} strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-zinc-100 leading-tight group-hover:text-amber-400 transition-colors">{order.customer}</h3>
                        <p className="text-zinc-500 text-xs font-medium flex items-center gap-1.5 mt-1">
                          <Phone size={12} className="text-zinc-600" /> {order.phone}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6 flex-1">
                      <div className="flex items-start gap-2.5 text-zinc-400 text-sm">
                        <Layers size={14} className="text-zinc-600 mt-1 shrink-0" />
                        <span className="line-clamp-2 leading-relaxed text-zinc-300">{order.type}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-zinc-400 text-sm">
                        <Calendar size={14} className="text-zinc-600 shrink-0" />
                        <span>Due: <strong className="text-zinc-200">{new Date(order.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</strong></span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end pt-4 border-t border-zinc-800/50">
                      <div>
                        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Balance</p>
                        <span className={`text-lg font-black ${order.balance > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          KSh {(order.balance || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="w-9 h-9 bg-zinc-800/50 text-zinc-400 rounded-xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-zinc-950 transition-all border border-zinc-700">
                        <ChevronRight size={16} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

        </div>

        {/* Cinematic New Order Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.98, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.98, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-[#0f0f11] w-full max-w-4xl rounded-[2rem] shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[95vh] relative"
              >
                {/* Glowing top accent */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

                {/* Modal Header */}
                <div className="p-6 md:p-8 flex justify-between items-start border-b border-zinc-800/60 bg-zinc-900/20">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Draft New Order</h2>
                    <p className="text-amber-500/80 font-bold text-[10px] uppercase tracking-[0.2em] mt-1.5 flex items-center gap-1.5">
                      <Ruler size={12} /> Enter Details & Measurements
                    </p>
                  </div>
                  <motion.button 
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowModal(false)}
                    className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all border border-zinc-700/50"
                  >
                    <X size={18} strokeWidth={2} />
                  </motion.button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10 custom-scrollbar bg-[#0f0f11]">
                  
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-6 relative">
                    <div className="space-y-2 relative">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Client Name <span className="text-rose-500">*</span></label>
                      <input 
                        type="text" 
                        value={formData.customer} 
                        onChange={(e) => {
                          setFormData({...formData, customer: e.target.value}); 
                          setFormErrors(p => ({...p, customer: null}));
                          setActiveField('customer');
                          setShowSuggestions(true);
                        }} 
                        onFocus={() => { setActiveField('customer'); setShowSuggestions(true); }}
                        className={`w-full px-5 py-3.5 bg-zinc-900/50 rounded-xl transition-all font-medium text-sm text-white placeholder-zinc-600 border ${formErrors.customer ? 'border-rose-500/50 focus:border-rose-500' : 'border-zinc-800 focus:border-amber-500/50'} focus:ring-1 focus:ring-amber-500/20 outline-none`} 
                        placeholder="Type to auto-fill..." 
                        maxLength={50}
                      />
                    </div>
                    <div className="space-y-2 relative">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Phone Number <span className="text-rose-500">*</span></label>
                      <input 
                        type="text" 
                        value={formData.phone} 
                        onChange={(e) => {
                          setFormData({...formData, phone: e.target.value.replace(/[^\d+\s-]/g, '')}); 
                          setFormErrors(p => ({...p, phone: null}));
                          setActiveField('phone');
                          setShowSuggestions(true);
                        }} 
                        onFocus={() => { setActiveField('phone'); setShowSuggestions(true); }}
                        className={`w-full px-5 py-3.5 bg-zinc-900/50 rounded-xl transition-all font-medium text-sm text-white placeholder-zinc-600 border ${formErrors.phone ? 'border-rose-500/50 focus:border-rose-500' : 'border-zinc-800 focus:border-amber-500/50'} focus:ring-1 focus:ring-amber-500/20 outline-none`} 
                        placeholder="0712 345 678" 
                        maxLength={13}
                      />
                    </div>

                    {/* Auto-complete Dropdown */}
                    {showSuggestions && activeSuggestions.length > 0 && (
                      <div ref={suggestionsRef} className="absolute top-[85px] left-0 w-full bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                        {activeSuggestions.map(c => (
                          <div 
                            key={c.id} 
                            onClick={() => handleSuggestionClick(c)}
                            className="p-4 border-b border-zinc-700/50 hover:bg-zinc-700 cursor-pointer flex justify-between items-center transition-colors"
                          >
                            <span className="font-bold text-white text-sm">{c.name}</span>
                            <span className="text-xs font-medium text-zinc-400">{c.phone}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tailoring Toggle */}
                  <div className="flex items-center justify-between p-5 rounded-2xl border border-zinc-800 bg-zinc-900/30">
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">Requires Tailoring?</h4>
                      <p className="text-xs text-zinc-500 font-medium mt-0.5">Toggle off to log a standard purchase (no measurements).</p>
                    </div>
                    <button 
                      onClick={() => setFormData({...formData, isTailoring: !formData.isTailoring})}
                      className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out flex ${formData.isTailoring ? 'bg-amber-500 justify-end' : 'bg-zinc-700 justify-start'}`}
                    >
                      <motion.layout className="w-6 h-6 rounded-full bg-zinc-950 shadow-md" />
                    </button>
                  </div>

                  {/* Design & Financials */}
                  <div className="grid lg:grid-cols-2 gap-8 border-t border-zinc-800/50 pt-8">
                    <div className="space-y-6">
                      <div className="space-y-2 h-full flex flex-col">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Style Notes / Item <span className="text-rose-500">*</span></label>
                        <textarea id="field-type" rows="2" value={formData.type} onChange={(e) => {setFormData({...formData, type: e.target.value}); setFormErrors(p => ({...p, type: null}))}} className={`w-full px-5 py-4 bg-zinc-900/50 rounded-xl transition-all font-medium text-sm text-white placeholder-zinc-600 resize-none border ${formErrors.type ? 'border-rose-500/50 focus:border-rose-500' : 'border-zinc-800 focus:border-amber-500/50'} focus:ring-1 focus:ring-amber-500/20 outline-none`} placeholder="Brief description..."></textarea>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Fabric / Cloth Type</label>
                        <input type="text" value={formData.fabricType} onChange={(e) => setFormData({...formData, fabricType: e.target.value})} className="w-full px-5 py-3.5 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:border-amber-500/50 transition-all font-medium text-sm text-white outline-none" placeholder="e.g. Silk, Cotton..." />
                      </div>
                      <div className="space-y-2 h-full flex flex-col">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Additional Notes</label>
                        <textarea rows="2" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-5 py-4 bg-zinc-900/50 rounded-xl transition-all font-medium text-sm text-white placeholder-zinc-600 resize-none border border-zinc-800 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none" placeholder="Logistics, pickups..."></textarea>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Due Date / Pickup</label>
                        <input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full px-5 py-3.5 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:border-amber-500/50 transition-all font-medium text-sm text-white outline-none [color-scheme:dark]" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Total (KSh) <span className="text-rose-500">*</span></label>
                          <input id="field-amount" type="number" value={formData.amount} onChange={(e) => {setFormData({...formData, amount: e.target.value}); setFormErrors(p => ({...p, amount: null}))}} className={`w-full px-5 py-3.5 bg-zinc-900/80 rounded-xl transition-all font-bold text-white border ${formErrors.amount ? 'border-rose-500/50 focus:border-rose-500' : 'border-zinc-800 focus:border-amber-500/50'} outline-none`} placeholder="0" />
                        </div>
                        {formData.isTailoring && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Deposit (KSh)</label>
                            <input type="number" value={formData.deposit} onChange={(e) => setFormData({...formData, deposit: e.target.value})} className="w-full px-5 py-3.5 bg-zinc-900/30 border border-zinc-800 rounded-xl focus:border-amber-500/50 transition-all font-bold text-white outline-none" placeholder="0" />
                          </div>
                        )}
                      </div>
                      
                      {formData.isTailoring && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Material Cost (KSh)</label>
                            <input type="number" value={formData.materialCost} onChange={(e) => setFormData({...formData, materialCost: e.target.value})} className="w-full px-5 py-3.5 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:border-amber-500/50 transition-all font-bold text-white outline-none" placeholder="0" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Labor Cost (KSh)</label>
                            <input type="number" value={formData.laborCost} onChange={(e) => setFormData({...formData, laborCost: e.target.value})} className="w-full px-5 py-3.5 bg-zinc-900/50 border border-zinc-800 rounded-xl focus:border-amber-500/50 transition-all font-bold text-white outline-none" placeholder="0" />
                          </div>
                        </div>
                      )}
                      {(formData.amount || formData.deposit) && (
                        <div className="p-4 bg-zinc-800/80 rounded-xl flex items-center justify-between border border-zinc-700/50">
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Remaining Balance</span>
                          <span className="font-bold text-lg text-white">
                            KSh {Math.max(0, (parseFloat(formData.amount || 0) - parseFloat(formData.deposit || 0))).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Measurements & Design (Animated) */}
                  <AnimatePresence>
                    {formData.isTailoring && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-10 pt-6 border-t border-zinc-800/50">
                          <div>
                            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-zinc-800/50 pb-2">
                              Measurements <span className="text-[9px] font-medium text-zinc-600 normal-case">(inches)</span>
                            </h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
                              {['Chest', 'Waist', 'Shoulder', 'Sleeve', 'Neck', 'Length', 'Hip', 'Thigh'].map((m) => (
                                <div key={m} className="space-y-1.5 group">
                                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1 group-focus-within:text-amber-500 transition-colors">{m}</label>
                                  <input type="text" value={formData[m.toLowerCase()]} onChange={(e) => setFormData({...formData, [m.toLowerCase()]: e.target.value.replace(/[^\d.]/g, '')})} placeholder="—" className="w-full px-4 py-2.5 bg-zinc-900/30 border border-zinc-800 rounded-lg focus:border-amber-500/50 focus:bg-zinc-900 transition-all font-mono text-sm text-white text-center outline-none" />
                                </div>
                              ))}
                            </div>
                            
                            {/* Custom Measurement Field */}
                            <div className="flex items-end gap-3 p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl">
                              <div className="flex-1 space-y-1.5">
                                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Other Detail Name</label>
                                <input type="text" value={formData.customMeasureName} onChange={(e) => setFormData({...formData, customMeasureName: e.target.value})} placeholder="e.g. Inseam" className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:border-amber-500/50 text-sm text-white outline-none" />
                              </div>
                              <div className="w-32 space-y-1.5">
                                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Value</label>
                                <input type="text" value={formData.customMeasureValue} onChange={(e) => setFormData({...formData, customMeasureValue: e.target.value.replace(/[^\d.]/g, '')})} placeholder="—" className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:border-amber-500/50 text-sm text-white text-center outline-none" />
                              </div>
                            </div>

                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-zinc-950 border-t border-zinc-800 flex justify-end gap-3 rounded-b-[2rem]">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -10px rgba(245, 158, 11, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateOrder}
                    className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-zinc-950 rounded-xl font-black tracking-widest uppercase text-xs shadow-lg transition-all"
                  >
                    Create Draft
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Details & Payment Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.98, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 20 }}
                className="bg-[#0f0f11] w-full max-w-2xl rounded-[2rem] shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="p-6 border-b border-zinc-800/60 bg-zinc-900/20 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-black text-white">{selectedOrder.customer}'s Order</h2>
                    <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest mt-1">{selectedOrder.id}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
                    <X size={18} strokeWidth={2} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Amount</span>
                      <p className="text-xl font-black text-white mt-1">KSh {(selectedOrder.amount || 0).toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Current Balance</span>
                      <p className={`text-xl font-black mt-1 ${selectedOrder.balance > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        KSh {(selectedOrder.balance || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Add Payment Form */}
                  {selectedOrder.balance > 0 && (
                    <div className="p-5 border border-zinc-800 bg-zinc-900/30 rounded-xl space-y-4">
                      <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                        <Banknote size={14} /> Record Payment / Reduction
                      </h3>
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-1.5">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Amount to pay (KSh)</label>
                          <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg focus:border-amber-500/50 text-white font-bold outline-none" placeholder="0" />
                        </div>
                        <div className="flex-[2] space-y-1.5">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Note / Details</label>
                          <input type="text" value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg focus:border-amber-500/50 text-white font-medium outline-none" placeholder="e.g. Paid in full, picked trousers..." />
                        </div>
                      </div>
                      <button onClick={handleRecordPayment} className="w-full py-3 bg-amber-500 text-zinc-950 rounded-lg font-black uppercase tracking-widest text-xs hover:bg-amber-400 transition-colors">
                        Submit Payment
                      </button>
                    </div>
                  )}

                  {/* Payment History */}
                  <div>
                    <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Payment & Note Log</h3>
                    {(!selectedOrder.payments || selectedOrder.payments.length === 0) ? (
                      <p className="text-sm text-zinc-600">No payments recorded yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedOrder.payments.map((p, i) => (
                          <div key={i} className="flex justify-between items-center p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
                            <div>
                              <p className="text-sm font-bold text-zinc-200">{p.note}</p>
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                                {new Date(p.date).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                              </p>
                            </div>
                            <span className="font-black text-emerald-400">KSh {p.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
      
      {/* Scrollbar styling for dark mode */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #3f3f46;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #52525b;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default TailoringPage;

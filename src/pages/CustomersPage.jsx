import React, { useState, useEffect, useRef, useMemo } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Phone, History, Ruler, ChevronRight, UserPlus, X, ShoppingCart, Scissors, CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CustomersPage = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [historyCustomer, setHistoryCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Payment state
  const [paymentOrder, setPaymentOrder] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('Partial Payment');

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('lucy_customers');
    return saved ? JSON.parse(saved) : [];
  });
  
  const defaultOrder = { 
    name: '', phone: '', item: '', amount: '', deposit: '',
    date: new Date().toISOString().split('T')[0], dueDate: new Date().toISOString().split('T')[0],
    isTailoring: false, fabricType: '', notes: '',
    chest: '', waist: '', shoulder: '', sleeve: '', neck: '', length: '', hip: '', thigh: '',
    customMeasureName: '', customMeasureValue: ''
  };

  const [newOrder, setNewOrder] = useState(defaultOrder);
  const [formErrors, setFormErrors] = useState({});

  // Auto-complete logic
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const suggestionsRef = useRef(null);

  const activeSuggestions = customers.filter(c => {
    if (!newOrder[activeField] || newOrder[activeField].length < 2) return false;
    return c[activeField].toLowerCase().includes(newOrder[activeField].toLowerCase());
  }).slice(0, 5); // Limit to top 5

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
    let customMName = '';
    let customMValue = '';
    const stdKeys = ['chest', 'waist', 'shoulder', 'sleeve', 'neck', 'length', 'hip', 'thigh'];
    
    if (c.measurements) {
      for (const [key, value] of Object.entries(c.measurements)) {
        if (!stdKeys.includes(key) && value) {
          customMName = key;
          customMValue = value;
          break;
        }
      }
    }

    setNewOrder(prev => ({
      ...prev,
      name: c.name,
      phone: c.phone,
      ...(c.measurements || {}),
      customMeasureName: customMName,
      customMeasureValue: customMValue
    }));
    setShowSuggestions(false);
  };

  // Flatten customers into individual visits based on history
  const allVisits = useMemo(() => {
    let visits = [];
    customers.forEach(customer => {
      if (customer.history && customer.history.length > 0) {
        customer.history.forEach(h => {
          visits.push({
            ...customer,
            visitId: h.id,
            visitDate: h.date,
            visitItem: h.item,
            visitAmount: h.amount,
            visitBalance: h.balance
          });
        });
      } else {
        visits.push({
          ...customer,
          visitId: customer.id,
          visitDate: customer.lastOrder,
          visitItem: 'Initial',
          visitAmount: customer.totalSpent,
          visitBalance: 0
        });
      }
    });
    
    // Sort all visits by date descending
    return visits.sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());
  }, [customers]);

  const filteredVisits = allVisits.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.phone.includes(searchTerm)
  );

  const handleSaveOrder = () => {
    let errors = {};
    if (!newOrder.name.trim()) errors.name = "Required";
    if (!newOrder.phone.trim()) {
      errors.phone = "Required";
    } else if (newOrder.phone.replace(/[^\d]/g, '').length < 9) {
      errors.phone = "Invalid format";
    }
    if (!newOrder.item.trim()) errors.item = "Item/Service required";
    if (!newOrder.amount || parseFloat(newOrder.amount) <= 0) errors.amount = "Valid amount required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    const amountNum = parseFloat(newOrder.amount);
    const depositNum = parseFloat(newOrder.deposit || 0);
    const orderId = `ORD-${Date.now().toString().slice(-4)}`;

    // 1. Save to global Sales
    const sales = JSON.parse(localStorage.getItem('lucy_sales') || '[]');
    const newSale = {
      id: orderId,
      productName: newOrder.item,
      soldPrice: amountNum, // The total value of the service/item
      cashCollected: depositNum > 0 ? depositNum : amountNum, // If no deposit, assume paid in full for standard items
      profit: amountNum,
      date: newOrder.date,
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' })
    };
    localStorage.setItem('lucy_sales', JSON.stringify([newSale, ...sales]));

    // 2. If Tailoring, save to Tailoring Orders
    let tailOrders = JSON.parse(localStorage.getItem('lucy_tailoring_orders') || '[]');
    if (newOrder.isTailoring) {
      const newTailoring = {
        id: orderId,
        customer: newOrder.name,
        phone: newOrder.phone,
        type: newOrder.item,
        fabricType: newOrder.fabricType,
        notes: newOrder.notes,
        amount: amountNum,
        deposit: depositNum,
        balance: amountNum - depositNum,
        dueDate: newOrder.dueDate,
        status: 'Pending',
        timestamp: new Date().toISOString(),
        payments: depositNum > 0 ? [{ amount: depositNum, date: new Date().toISOString(), note: 'Initial Deposit' }] : [],
        chest: newOrder.chest, waist: newOrder.waist, shoulder: newOrder.shoulder, sleeve: newOrder.sleeve,
        neck: newOrder.neck, length: newOrder.length, hip: newOrder.hip, thigh: newOrder.thigh,
        customMeasureName: newOrder.customMeasureName,
        customMeasureValue: newOrder.customMeasureValue
      };
      tailOrders = [newTailoring, ...tailOrders];
      localStorage.setItem('lucy_tailoring_orders', JSON.stringify(tailOrders));
    }

    // 3. Update or Create Customer
    const existingIndex = customers.findIndex(c => c.phone === newOrder.phone || c.name.toLowerCase() === newOrder.name.toLowerCase());
    let updatedCustomers = [...customers];
    
    const purchaseLog = {
      id: orderId,
      item: newOrder.item,
      amount: amountNum,
      deposit: depositNum,
      balance: newOrder.isTailoring ? (amountNum - depositNum) : 0,
      date: newOrder.date,
      isTailoring: newOrder.isTailoring,
      payments: (newOrder.isTailoring && depositNum > 0) ? [{ amount: depositNum, date: new Date().toISOString(), note: 'Initial Deposit' }] : []
    };

    const newMeasurements = newOrder.isTailoring ? {
      chest: newOrder.chest, waist: newOrder.waist, shoulder: newOrder.shoulder, sleeve: newOrder.sleeve,
      neck: newOrder.neck, length: newOrder.length, hip: newOrder.hip, thigh: newOrder.thigh,
      [newOrder.customMeasureName]: newOrder.customMeasureValue
    } : {};

    if (existingIndex >= 0) {
      const c = updatedCustomers[existingIndex];
      updatedCustomers.splice(existingIndex, 1);
      updatedCustomers.unshift({
        ...c,
        totalSpent: (c.totalSpent || 0) + amountNum,
        lastOrder: new Date().toISOString(),
        history: [purchaseLog, ...(c.history || [])],
        measurements: newOrder.isTailoring ? {
          ...c.measurements,
          ...newMeasurements
        } : c.measurements
      });
    } else {
      updatedCustomers.unshift({
        id: `CUST-${Date.now().toString().slice(-4)}`,
        name: newOrder.name,
        phone: newOrder.phone,
        email: '',
        lastOrder: new Date().toISOString(),
        totalSpent: amountNum,
        history: [purchaseLog],
        measurements: newMeasurements
      });
    }

    setCustomers(updatedCustomers);
    localStorage.setItem('lucy_customers', JSON.stringify(updatedCustomers));
    
    setNewOrder(defaultOrder);
    setShowModal(false);
  };

  const handleRecordPayment = () => {
    const amt = parseFloat(paymentAmount);
    if (!amt || amt <= 0 || !paymentOrder) return;
    
    let tailOrders = JSON.parse(localStorage.getItem('lucy_tailoring_orders') || '[]');
    let sales = JSON.parse(localStorage.getItem('lucy_sales') || '[]');
    let updatedCustomers = [...customers];
    
    // Find order in global tailoring
    const orderIndex = tailOrders.findIndex(o => o.id === paymentOrder.id);
    if (orderIndex >= 0) {
      tailOrders[orderIndex].balance -= amt;
      tailOrders[orderIndex].payments = [
        ...(tailOrders[orderIndex].payments || []),
        { amount: amt, date: new Date().toISOString(), note: paymentNote }
      ];
      localStorage.setItem('lucy_tailoring_orders', JSON.stringify(tailOrders));
    }

    // Add to Sales
    const paymentSale = {
      id: `PAY-${Date.now().toString().slice(-4)}`,
      productName: `Payment for ${paymentOrder.id}`,
      soldPrice: 0,
      cashCollected: amt,
      profit: 0,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' })
    };
    localStorage.setItem('lucy_sales', JSON.stringify([paymentSale, ...sales]));

    // Update Customer History directly in state & localstorage
    const custIndex = updatedCustomers.findIndex(c => c.id === historyCustomer.id);
    if (custIndex >= 0) {
      const histIndex = updatedCustomers[custIndex].history.findIndex(h => h.id === paymentOrder.id);
      if (histIndex >= 0) {
        updatedCustomers[custIndex].history[histIndex].balance -= amt;
        updatedCustomers[custIndex].history[histIndex].deposit = (updatedCustomers[custIndex].history[histIndex].deposit || 0) + amt;
        updatedCustomers[custIndex].history[histIndex].payments = [
          ...(updatedCustomers[custIndex].history[histIndex].payments || []),
          { amount: amt, date: new Date().toISOString(), note: paymentNote }
        ];
      }
      setCustomers(updatedCustomers);
      setHistoryCustomer(updatedCustomers[custIndex]); // update modal view
      localStorage.setItem('lucy_customers', JSON.stringify(updatedCustomers));
    }

    setPaymentOrder(null);
    setPaymentAmount('');
    setPaymentNote('Partial Payment');
  };

  return (
    <div className="bg-slate-50 min-h-screen relative overflow-x-hidden font-sans">
      <Header />
      <Sidebar />
      
      <main className="w-full p-4 md:p-8 pt-44 lg:pt-40">
        <div className="max-w-5xl mx-auto">
          
          <header className="flex flex-col items-center justify-center text-center gap-4 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Customer CRM</h1>
              <p className="text-slate-500 font-medium mt-2">Manage customer profiles, purchase history, and measurements.</p>
            </div>
            
            <div className="w-full max-w-md mt-4">
              <button 
                onClick={() => setShowModal(true)}
                className="w-full px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-sm font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-lg transition-all duration-300"
              >
                <UserPlus size={18} strokeWidth={2.5} />
                <span>Record Customer / Sale</span>
              </button>
            </div>
          </header>

          {/* Search Bar */}
          <div className="mb-8 relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or phone..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-sm focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all font-medium text-slate-700 outline-none shadow-sm"
            />
          </div>

          {/* Customer Table View */}
          <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
            {filteredVisits.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-medium">No records found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-slate-500">Client Details</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-slate-500">Contact & Visit Date</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-slate-500 text-right">Order Value</th>
                      <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-black text-slate-500 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVisits.map((visit, idx) => {
                      return (
                      <tr 
                        key={`${visit.id}-${visit.visitId}`} 
                        onClick={() => setHistoryCustomer(customers.find(c => c.id === visit.id))}
                        className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-slate-400 w-4">{idx + 1}.</span>
                            <div className="w-10 h-10 bg-slate-100 border border-slate-200 text-slate-600 rounded-sm flex items-center justify-center font-black text-sm group-hover:bg-slate-900 group-hover:text-white transition-colors">
                              {visit.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{visit.name}</h3>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{visit.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                            <span className="flex items-center gap-2"><Phone size={12} className="text-slate-400" /> {visit.phone}</span>
                            <span className="flex items-center gap-2 text-[10px] text-slate-400">
                              <History size={12} /> Visit: {visit.visitDate && visit.visitDate !== '-' ? new Date(visit.visitDate).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-sm font-black text-slate-900">KSh {(visit.visitAmount || 0).toLocaleString()}</span>
                            {visit.visitBalance > 0 && (
                              <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-sm uppercase tracking-widest border border-rose-100">
                                Due: KSh {visit.visitBalance.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedCustomer(customers.find(c => c.id === visit.id)); }}
                              disabled={!visit.measurements || Object.keys(visit.measurements).length === 0}
                              className="px-3 py-2 bg-slate-100 border border-slate-200 text-slate-600 rounded-sm font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-slate-200 hover:text-slate-900 transition-all disabled:opacity-30 disabled:hover:bg-slate-100 disabled:hover:text-slate-600"
                              title="Measurements"
                            >
                              <Ruler size={14} /> Measures
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setHistoryCustomer(customers.find(c => c.id === visit.id)); }}
                              className="px-3 py-2 bg-slate-900 text-white rounded-sm font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-slate-800 transition-all shadow-sm"
                              title="Purchase History"
                            >
                              History <ChevronRight size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* History Modal */}
        <AnimatePresence>
          {historyCustomer && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.98, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 10 }}
                className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">{historyCustomer.name}'s History</h2>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Transaction Log</p>
                  </div>
                  <button onClick={() => setHistoryCustomer(null)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
                    <X size={20} strokeWidth={2} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  {(!historyCustomer.history || historyCustomer.history.length === 0) ? (
                    <div className="text-center py-10 text-slate-400 font-medium">No purchase history recorded.</div>
                  ) : (
                    <div className="space-y-3">
                      {historyCustomer.history.map((h, i) => (
                        <div key={i} className="flex flex-col p-4 border border-slate-200 rounded-sm hover:border-slate-300 transition-colors bg-white gap-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-sm flex items-center justify-center border ${h.isTailoring ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                {h.isTailoring ? <Scissors size={18} /> : <ShoppingCart size={18} />}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800 text-sm">{h.item}</h4>
                                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">{new Date(h.date).toLocaleDateString()} • {h.id}</p>
                              </div>
                            </div>
                            <span className="font-black text-slate-900 text-sm">KSh {h.amount?.toLocaleString()}</span>
                          </div>
                          
                          {/* Payment Status for this order */}
                          {h.isTailoring && (
                            <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex flex-col gap-1">
                                <span>Deposit: <span className="text-slate-700">KSh {h.deposit?.toLocaleString()}</span></span>
                                <span>Balance: <span className={h.balance > 0 ? "text-rose-500" : "text-emerald-500"}>KSh {h.balance?.toLocaleString()}</span></span>
                              </div>
                              {h.balance > 0 && (
                                <button 
                                  onClick={() => setPaymentOrder(h)}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-sm font-bold text-[10px] uppercase tracking-widest transition-colors flex items-center gap-1.5 border border-slate-200"
                                >
                                  Pay Balance
                                </button>
                              )}
                            </div>
                          )}

                          {/* Quick Payment UI Inline */}
                          {paymentOrder && paymentOrder.id === h.id && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 pt-3 border-t border-slate-100 overflow-hidden">
                              <div className="flex gap-2">
                                <input 
                                  type="number" 
                                  value={paymentAmount} 
                                  onChange={e => setPaymentAmount(e.target.value)} 
                                  placeholder={`Max KSh ${h.balance}`}
                                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-sm outline-none focus:border-slate-400 font-bold"
                                />
                                <button onClick={handleRecordPayment} className="px-4 py-2 bg-slate-900 text-white rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-slate-800">
                                  Save
                                </button>
                                <button onClick={() => setPaymentOrder(null)} className="px-3 py-2 bg-white border border-slate-200 text-slate-400 rounded-sm hover:text-rose-500">
                                  <X size={16} />
                                </button>
                              </div>
                            </motion.div>
                          )}

                          {/* Payment Log History */}
                          {h.payments && h.payments.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-100">
                              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Payment Log</h4>
                              <div className="space-y-1.5">
                                {h.payments.map((p, pIndex) => (
                                  <div key={pIndex} className="flex justify-between items-center bg-slate-50 p-2 rounded-sm border border-slate-100">
                                    <div>
                                      <p className="text-[10px] font-bold text-slate-700">{p.note || 'Payment'}</p>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                        {new Date(p.date).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                                      </p>
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-600">+ KSh {p.amount?.toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Measurements Modal */}
        <AnimatePresence>
          {selectedCustomer && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.98, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 10 }}
                className="bg-white w-full max-w-xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">{selectedCustomer.name}'s Measures</h2>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Saved Measurements (Inches)</p>
                  </div>
                  <button onClick={() => setSelectedCustomer(null)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
                    <X size={20} strokeWidth={2} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {selectedCustomer.measurements && Object.entries(selectedCustomer.measurements).filter(([_, v]) => v).map(([key, value]) => (
                      <div key={key} className="p-3 border border-slate-200 rounded-sm bg-slate-50 text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{key}</p>
                        <p className="text-lg font-mono font-bold text-slate-800">{value || '—'}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <button onClick={() => setSelectedCustomer(null)} className="px-6 py-3 bg-slate-900 text-white rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-slate-800 w-full sm:w-auto transition-colors">Close Measurements</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Record Sale Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.98, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 10 }}
                className="bg-white w-full max-w-3xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-200 relative"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Record Sale & Customer</h2>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">Log purchase and update CRM</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
                    <X size={20} strokeWidth={2} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative">
                  
                  {/* Customer Info with Auto-complete */}
                  <div className="grid md:grid-cols-2 gap-5 relative">
                    <div className="space-y-1.5 relative">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Client Name <span className="text-rose-500">*</span></label>
                      <input 
                        type="text" 
                        value={newOrder.name} 
                        onChange={(e) => {
                          setNewOrder({...newOrder, name: e.target.value}); 
                          setFormErrors(p => ({...p, name: null}));
                          setActiveField('name');
                          setShowSuggestions(true);
                        }} 
                        onFocus={() => { setActiveField('name'); setShowSuggestions(true); }}
                        className={`w-full px-4 py-3 bg-white border ${formErrors.name ? 'border-rose-400' : 'border-slate-200 focus:border-slate-400'} rounded-sm transition-all font-medium text-sm outline-none`} 
                        placeholder="Type name to auto-fill..." 
                        maxLength={50}
                      />
                    </div>
                    <div className="space-y-1.5 relative">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone <span className="text-rose-500">*</span></label>
                      <input 
                        type="text" 
                        value={newOrder.phone} 
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^\d+\s-]/g, '');
                          setNewOrder({...newOrder, phone: val}); 
                          setFormErrors(p => ({...p, phone: null}));
                          setActiveField('phone');
                          setShowSuggestions(true);
                        }} 
                        onFocus={() => { setActiveField('phone'); setShowSuggestions(true); }}
                        className={`w-full px-4 py-3 bg-white border ${formErrors.phone ? 'border-rose-400' : 'border-slate-200 focus:border-slate-400'} rounded-sm transition-all font-medium text-sm outline-none`} 
                        placeholder="e.g. 0712345678" 
                        maxLength={13}
                      />
                    </div>
                    
                    {/* Auto-complete Dropdown */}
                    {showSuggestions && activeSuggestions.length > 0 && (
                      <div ref={suggestionsRef} className="absolute top-[70px] left-0 w-full bg-white border border-slate-200 rounded-sm shadow-xl z-50 overflow-hidden">
                        {activeSuggestions.map(c => (
                          <div 
                            key={c.id} 
                            onClick={() => handleSuggestionClick(c)}
                            className="p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex justify-between items-center transition-colors"
                          >
                            <span className="font-bold text-slate-800 text-sm">{c.name}</span>
                            <span className="text-xs font-medium text-slate-500">{c.phone}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Purchase Info */}
                  <div className="bg-slate-50 p-5 rounded-sm border border-slate-200 space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-2"><ShoppingCart size={14} /> Purchase Details</h3>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Item or Service <span className="text-rose-500">*</span></label>
                      <input type="text" value={newOrder.item} onChange={(e) => {setNewOrder({...newOrder, item: e.target.value}); setFormErrors(p => ({...p, item: null}))}} className={`w-full px-4 py-3 bg-white border ${formErrors.item ? 'border-rose-400' : 'border-slate-200 focus:border-slate-400'} rounded-sm transition-all font-medium text-sm outline-none`} placeholder="e.g. Ready-made Dress, Alteration..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Date Logged</label>
                        <input type="date" value={newOrder.date} onChange={(e) => setNewOrder({...newOrder, date: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-slate-400 rounded-sm transition-all font-medium text-sm outline-none" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Total Amount (KSh) <span className="text-rose-500">*</span></label>
                        <input type="number" value={newOrder.amount} onChange={(e) => {setNewOrder({...newOrder, amount: e.target.value}); setFormErrors(p => ({...p, amount: null}))}} className={`w-full px-4 py-3 bg-white border ${formErrors.amount ? 'border-rose-400' : 'border-slate-200 focus:border-slate-400'} rounded-sm transition-all font-bold text-slate-900 outline-none`} placeholder="0" />
                      </div>
                    </div>
                  </div>

                  {/* Tailoring Toggle */}
                  <div className="flex items-center justify-between p-4 border border-slate-200 bg-white rounded-sm">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Requires Tailoring?</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">Toggle to add custom measurements, deposits, and due dates.</p>
                    </div>
                    <button 
                      onClick={() => setNewOrder({...newOrder, isTailoring: !newOrder.isTailoring})}
                      className={`w-12 h-6 rounded-sm p-1 transition-colors duration-200 flex border ${newOrder.isTailoring ? 'bg-slate-900 border-slate-900 justify-end' : 'bg-slate-100 border-slate-300 justify-start'}`}
                    >
                      <motion.div layout className={`w-4 h-4 rounded-sm shadow-sm ${newOrder.isTailoring ? 'bg-white' : 'bg-white border border-slate-300'}`} />
                    </button>
                  </div>

                  {/* Animated Tailoring Section */}
                  <AnimatePresence>
                    {newOrder.isTailoring && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 border border-slate-200 rounded-sm mt-4 bg-white space-y-8">
                          
                          {/* Design & Fabric */}
                          <div>
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-4"><Scissors size={14} /> Design & Fabric</h3>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Type of Cloth / Fabric Description</label>
                              <input type="text" value={newOrder.fabricType} onChange={(e) => setNewOrder({...newOrder, fabricType: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-sm transition-all font-medium text-sm outline-none" placeholder="e.g. Silk, Ankara, Cotton blend..." />
                            </div>
                          </div>

                          {/* Measurements */}
                          <div>
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-4"><Ruler size={14} /> Measurements (inches)</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
                              {['Chest', 'Waist', 'Shoulder', 'Sleeve', 'Neck', 'Length', 'Hip', 'Thigh'].map((m) => (
                                <div key={m} className="space-y-1.5">
                                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{m}</label>
                                  <input type="text" value={newOrder[m.toLowerCase()]} onChange={(e) => setNewOrder({...newOrder, [m.toLowerCase()]: e.target.value.replace(/[^\d.]/g, '')})} placeholder="—" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm focus:border-slate-400 focus:bg-white transition-all font-mono text-sm text-center outline-none" />
                                </div>
                              ))}
                            </div>
                            {/* Custom Measurement Field */}
                            <div className="flex items-end gap-3 p-3 bg-slate-50 border border-slate-200 rounded-sm">
                              <div className="flex-1 space-y-1.5">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Other Detail Name</label>
                                <input type="text" value={newOrder.customMeasureName} onChange={(e) => setNewOrder({...newOrder, customMeasureName: e.target.value})} placeholder="e.g. Bicep, Inseam" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm focus:border-slate-400 text-sm outline-none" />
                              </div>
                              <div className="w-24 space-y-1.5">
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Value</label>
                                <input type="text" value={newOrder.customMeasureValue} onChange={(e) => setNewOrder({...newOrder, customMeasureValue: e.target.value.replace(/[^\d.]/g, '')})} placeholder="—" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm focus:border-slate-400 text-sm text-center outline-none" />
                              </div>
                            </div>
                          </div>

                          {/* Notes */}
                          <div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Additional Notes</label>
                              <textarea value={newOrder.notes} onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})} rows="2" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-sm transition-all font-medium text-sm outline-none resize-none" placeholder="Special requests, partial pickups, etc..."></textarea>
                            </div>
                          </div>

                          {/* Financials & Dates */}
                          <div className="pt-6 border-t border-slate-100">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-4"><CreditCard size={14} /> Tailoring Financials</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Deposit Paid (KSh)</label>
                                <input type="number" value={newOrder.deposit} onChange={(e) => setNewOrder({...newOrder, deposit: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-sm transition-all font-bold text-slate-900 outline-none" placeholder="0" />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Due Date / Pickup</label>
                                <input type="date" value={newOrder.dueDate} onChange={(e) => setNewOrder({...newOrder, dueDate: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-sm transition-all font-medium text-sm outline-none" />
                              </div>
                            </div>
                            
                            {/* Real-time Balance Calc */}
                            {(newOrder.amount || newOrder.deposit) && (
                              <div className="mt-4 p-4 bg-slate-900 rounded-sm flex items-center justify-between text-white">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Remaining Balance</span>
                                <span className="font-bold text-lg">
                                  KSh {Math.max(0, (parseFloat(newOrder.amount || 0) - parseFloat(newOrder.deposit || 0))).toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 z-10 relative">
                  <button onClick={() => setShowModal(false)} className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">Cancel</button>
                  <button 
                    onClick={handleSaveOrder}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-sm font-black uppercase tracking-widest text-xs shadow-md hover:bg-slate-800 transition-all"
                  >
                    Save Entry
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 2px; }
      `}} />
    </div>
  );
};

export default CustomersPage;

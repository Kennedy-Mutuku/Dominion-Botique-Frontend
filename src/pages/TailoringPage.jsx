import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { 
  Scissors, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  User,
  Phone,
  Calendar,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TailoringPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [formErrors, setFormErrors] = useState({});

  const getDraft = () => {
    const draft = localStorage.getItem('lucy_draft_tailoring');
    if (draft) {
      try { return JSON.parse(draft); } catch(e) {}
    }
    return { customer: '', phone: '', chest: '', waist: '', shoulder: '', sleeve: '', neck: '', length: '', hip: '', thigh: '', type: '', dueDate: '', amount: '', deposit: '' };
  };

  const [formData, setFormData] = React.useState(getDraft());

  React.useEffect(() => {
    localStorage.setItem('lucy_draft_tailoring', JSON.stringify(formData));
  }, [formData]);

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('lucy_tailoring_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'ready': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'in-progress': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
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
    if (!formData.customer.trim()) errors.customer = "Customer Name is required";
    if (!formData.phone.trim()) {
      errors.phone = "Phone Number is required";
    } else if (formData.phone.replace(/[^\d]/g, '').length < 9) {
      errors.phone = "Please enter a valid phone number";
    }
    if (!formData.type.trim()) errors.type = "Design Style is required";
    if (!formData.amount || parseFloat(formData.amount) <= 0) errors.amount = "Valid Total Amount is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstErrorField = Object.keys(errors)[0];
      const el = document.getElementById(`field-${firstErrorField}`);
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setFormErrors({});

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      status: 'Pending',
      ...formData,
      amount: parseFloat(formData.amount || 0),
      deposit: parseFloat(formData.deposit || 0),
      timestamp: new Date().toISOString()
    };
    
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('lucy_tailoring_orders', JSON.stringify(updatedOrders));

    // Auto-Sync to Customers CRM
    const customers = JSON.parse(localStorage.getItem('lucy_customers') || '[]');
    const existing = customers.find(c => c.phone === formData.phone || c.name.toLowerCase() === formData.customer.toLowerCase());
    
    if (!existing) {
      const newCustomer = {
        id: `CUST-${Date.now().toString().slice(-4)}`,
        name: formData.customer,
        phone: formData.phone,
        email: '',
        lastOrder: new Date().toISOString().split('T')[0],
        totalSpent: newOrder.amount,
        measurements: {
          chest: formData.chest, waist: formData.waist, shoulder: formData.shoulder, sleeve: formData.sleeve,
          neck: formData.neck, length: formData.length, hip: formData.hip, thigh: formData.thigh
        }
      };
      localStorage.setItem('lucy_customers', JSON.stringify([newCustomer, ...customers]));
    } else {
      const updatedCustomers = customers.map(c => {
        if (c.id === existing.id) {
          return {
            ...c,
            totalSpent: (c.totalSpent || 0) + newOrder.amount,
            lastOrder: new Date().toISOString().split('T')[0],
            measurements: {
              chest: formData.chest || c.measurements?.chest, waist: formData.waist || c.measurements?.waist,
              shoulder: formData.shoulder || c.measurements?.shoulder, sleeve: formData.sleeve || c.measurements?.sleeve,
              neck: formData.neck || c.measurements?.neck, length: formData.length || c.measurements?.length,
              hip: formData.hip || c.measurements?.hip, thigh: formData.thigh || c.measurements?.thigh
            }
          };
        }
        return c;
      });
      localStorage.setItem('lucy_customers', JSON.stringify(updatedCustomers));
    }
    
    setFormData({ customer: '', phone: '', chest: '', waist: '', shoulder: '', sleeve: '', neck: '', length: '', hip: '', thigh: '', type: '', dueDate: '', amount: '', deposit: '' });
    localStorage.removeItem('lucy_draft_tailoring');
    setShowModal(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen relative overflow-x-hidden">
      <Header />
      <Sidebar />
      
      <main className="w-full p-3 md:p-8 pt-44 lg:pt-40 overflow-x-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex items-start md:items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-3 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl transition-all shadow-sm shrink-0"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">Tailoring Management</h1>
              <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">Track measurements, designs, and order progress.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(245,158,11,0.4)] hover:shadow-[0_8px_40px_rgba(245,158,11,0.6)] hover:-translate-y-1 transition-all duration-300"
          >
            <Plus size={20} className="stroke-[3]" />
            <span>New Order</span>
          </button>
        </header>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name or order ID..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Pending', 'In-Progress', 'Ready'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all border ${
                  activeTab === tab ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white p-16 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center mt-4">
            <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-6">
              <Scissors size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">No active orders</h3>
            <p className="text-slate-500 font-medium max-w-md">There are no tailoring orders matching your filters right now. Click 'New Order' above to get started!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.id}</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                      <User size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{order.customer}</h3>
                      <p className="text-slate-400 text-sm font-semibold flex items-center gap-1">
                        <Phone size={14} /> {order.phone}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-slate-600 font-medium">
                      <Layers size={18} className="text-blue-500" />
                      <span>{order.type}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 font-medium">
                      <Calendar size={18} className="text-purple-500" />
                      <span>Due: {new Date(order.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                    <span className="text-2xl font-black text-slate-900">KSh {(order.amount || 0).toLocaleString()}</span>
                    <button 
                      onClick={() => alert(`Viewing details for ${order.id}`)}
                      className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Order Modal (Measurement Form) */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden fade-in max-h-[90vh] flex flex-col">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Create New Tailoring Order</h2>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Fill in customer measurements & details</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                {/* Customer Details */}
                <section>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                    Customer Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 relative">
                      <label className="text-sm font-bold text-slate-600 ml-1">Customer Name <span className="text-rose-500">*</span></label>
                      <input id="field-customer" type="text" value={formData.customer} onChange={(e) => {setFormData({...formData, customer: e.target.value}); setFormErrors(p => ({...p, customer: null}))}} placeholder="e.g. Kennedy Mutuku" className={`w-full px-5 py-3.5 bg-slate-50 rounded-2xl transition-all font-medium border-2 focus:ring-4 focus:ring-blue-500/10 ${formErrors.customer ? 'border-rose-400 bg-rose-50' : 'border-transparent'}`} />
                      {formErrors.customer && <p className="text-xs font-bold text-rose-500 absolute -bottom-5 left-2 animate-in fade-in slide-in-from-top-1">{formErrors.customer}</p>}
                    </div>
                    <div className="space-y-2 relative">
                      <label className="text-sm font-bold text-slate-600 ml-1">Phone Number <span className="text-rose-500">*</span></label>
                      <input id="field-phone" type="text" value={formData.phone} onChange={(e) => {setFormData({...formData, phone: e.target.value.replace(/[^\d+\s-]/g, '')}); setFormErrors(p => ({...p, phone: null}))}} placeholder="e.g. 0712345678" className={`w-full px-5 py-3.5 bg-slate-50 rounded-2xl transition-all font-medium border-2 focus:ring-4 focus:ring-blue-500/10 ${formErrors.phone ? 'border-rose-400 bg-rose-50' : 'border-transparent'}`} />
                      {formErrors.phone && <p className="text-xs font-bold text-rose-500 absolute -bottom-5 left-2 animate-in fade-in slide-in-from-top-1">{formErrors.phone}</p>}
                    </div>
                  </div>
                </section>

                {/* Measurements Grid */}
                <section>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                    Body Measurements (inches)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Chest', 'Waist', 'Shoulder', 'Sleeve', 'Neck', 'Length', 'Hip', 'Thigh'].map((m) => (
                      <div key={m} className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{m} <span className="text-slate-300 font-normal lowercase">(opt)</span></label>
                        <input type="text" value={formData[m.toLowerCase()]} onChange={(e) => setFormData({...formData, [m.toLowerCase()]: e.target.value.replace(/[^\d.]/g, '')})} placeholder="0.0" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-purple-500/10 transition-all font-bold text-center" />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Design & Order Details */}
                <section>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
                    Design & Logistics
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2 relative h-full flex flex-col">
                      <label className="text-sm font-bold text-slate-600 ml-1">Design Style/Notes <span className="text-rose-500">*</span></label>
                      <textarea id="field-type" rows="3" value={formData.type} onChange={(e) => {setFormData({...formData, type: e.target.value}); setFormErrors(p => ({...p, type: null}))}} placeholder="Describe the design or specific requests..." className={`w-full flex-1 px-5 py-3.5 bg-slate-50 rounded-2xl transition-all font-medium resize-none border-2 focus:ring-4 focus:ring-amber-500/10 ${formErrors.type ? 'border-rose-400 bg-rose-50' : 'border-transparent'}`}></textarea>
                      {formErrors.type && <p className="text-xs font-bold text-rose-500 absolute -bottom-5 left-2 animate-in fade-in slide-in-from-top-1">{formErrors.type}</p>}
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-600 ml-1">Due Date</label>
                        <input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border-transparent border-2 rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all font-medium" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 relative">
                          <label className="text-sm font-bold text-slate-600 ml-1">Total Amount <span className="text-rose-500">*</span></label>
                          <input id="field-amount" type="number" value={formData.amount} onChange={(e) => {setFormData({...formData, amount: e.target.value}); setFormErrors(p => ({...p, amount: null}))}} placeholder="0" className={`w-full px-5 py-3.5 bg-slate-50 rounded-2xl transition-all font-bold border-2 focus:ring-4 focus:ring-emerald-500/10 ${formErrors.amount ? 'border-rose-400 bg-rose-50' : 'border-transparent'}`} />
                          {formErrors.amount && <p className="text-xs font-bold text-rose-500 absolute -bottom-5 left-1 animate-in fade-in slide-in-from-top-1 leading-tight">{formErrors.amount}</p>}
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-600 ml-1">Deposit</label>
                          <input type="number" value={formData.deposit} onChange={(e) => setFormData({...formData, deposit: e.target.value})} placeholder="0" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-white/80 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateOrder}
                  className="px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-black tracking-[0.1em] uppercase text-sm shadow-[0_8px_30px_rgba(245,158,11,0.4)] hover:shadow-[0_8px_40px_rgba(245,158,11,0.6)] hover:-translate-y-1 transition-all"
                >
                  Create Order
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TailoringPage;

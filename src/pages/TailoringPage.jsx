import React, { useState } from 'react';
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
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TailoringPage = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const orders = [
    { id: 'ORD-001', customer: 'Alice Johnson', phone: '0712345678', type: 'Wedding Dress', status: 'In-Progress', dueDate: '2023-11-15', amount: 15000 },
    { id: 'ORD-002', customer: 'Bob Smith', phone: '0722334455', type: 'Business Suit', status: 'Pending', dueDate: '2023-11-20', amount: 12000 },
    { id: 'ORD-003', customer: 'Catherine Lee', phone: '0733445566', type: 'School Uniform', status: 'Ready', dueDate: '2023-11-10', amount: 3500 },
  ];

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
    alert('🎉 Tailoring Order Created Successfully!');
    setShowModal(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen relative overflow-x-hidden">
      <Header />
      <Sidebar />
      
      <main className="w-full p-3 md:p-8 pt-44 lg:pt-40 overflow-x-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">Tailoring Management</h1>
            <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">Track measurements, designs, and order progress.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto px-6 py-3 premium-gradient text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <Plus size={20} />
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
                className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Grid */}
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
                  <span className="text-2xl font-black text-slate-900">KSh {order.amount.toLocaleString()}</span>
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
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600 ml-1">Customer Name</label>
                      <input type="text" placeholder="e.g. Kennedy Mutuku" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600 ml-1">Phone Number</label>
                      <input type="text" placeholder="e.g. 0712345678" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all font-medium" />
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
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{m}</label>
                        <input type="text" placeholder="0.0" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-4 focus:ring-purple-500/10 transition-all font-bold text-center" />
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
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600 ml-1">Design Style/Notes</label>
                      <textarea rows="3" placeholder="Describe the design or specific requests..." className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-amber-500/10 transition-all font-medium resize-none"></textarea>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-600 ml-1">Due Date</label>
                        <input type="date" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all font-medium" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-600 ml-1">Total Amount</label>
                          <input type="number" placeholder="0" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-600 ml-1">Deposit</label>
                          <input type="number" placeholder="0" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold" />
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
                  className="px-10 py-3 premium-gradient text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
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

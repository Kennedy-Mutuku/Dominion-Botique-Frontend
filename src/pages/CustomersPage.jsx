import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  History, 
  Ruler, 
  ChevronRight,
  MoreVertical,
  Filter,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CustomersPage = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const customers = [
    { id: 'CUST-001', name: 'Alice Johnson', phone: '0712345678', email: 'alice@example.com', lastOrder: '2023-10-24', totalSpent: 25000, measurements: { chest: '34', waist: '28', shoulder: '15' } },
    { id: 'CUST-002', name: 'Bob Smith', phone: '0722334455', email: 'bob@example.com', lastOrder: '2023-10-15', totalSpent: 12000, measurements: { chest: '40', waist: '34', shoulder: '18' } },
    { id: 'CUST-003', name: 'Catherine Lee', phone: '0733445566', email: 'cat@example.com', lastOrder: '2023-09-30', totalSpent: 3500, measurements: { chest: '32', waist: '26', shoulder: '14' } },
  ];

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="bg-slate-50 min-h-screen relative overflow-x-hidden">
      <Header />
      <Sidebar />
      
      <main className="w-full p-4 md:p-8 pt-44 lg:pt-40">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Customer CRM</h1>
            <p className="text-slate-500 font-medium mt-1">Manage customer profiles, history, and measurements.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto px-6 py-3 premium-gradient text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <UserPlus size={20} />
            <span>Add Customer</span>
          </button>
        </header>

        {/* Search & Filter */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, phone or email..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium"
            />
          </div>
          <button className="px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-all">
            <Filter size={20} />
            <span>Filter List</span>
          </button>
        </div>

        {/* Customer List/Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform font-black text-xl">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{customer.name}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{customer.id}</p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                    <Phone size={16} className="text-slate-400" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                    <Mail size={16} className="text-slate-400" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                    <History size={16} className="text-slate-400" />
                    <span>Last Order: {new Date(customer.lastOrder).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                  <button 
                    onClick={() => setSelectedCustomer(customer)}
                    className="py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    <Ruler size={14} /> Measurements
                  </button>
                  <button className="py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all">
                    View History <ChevronRight size={14} />
                  </button>
                </div>
              </div>
              
              <div className="bg-slate-50 px-8 py-4 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Business</span>
                <span className="text-lg font-black text-slate-900">KSh {customer.totalSpent.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Measurement Quick View Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden fade-in">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Measurements</h2>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Saved for {selectedCustomer.name}</p>
                </div>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 gap-6">
                  {Object.entries(selectedCustomer.measurements).map(([key, value]) => (
                    <div key={key} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{key}</p>
                      <p className="text-xl font-black text-slate-800">{value}"</p>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => alert('🎉 Measurements updated successfully!')}
                  className="w-full mt-8 py-4 premium-gradient text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                >
                  Update Measurements
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Customer Modal (Simplified) */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden fade-in">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900">Add New Customer</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-rose-500 transition-colors">✕</button>
              </div>
              <div className="p-8 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Full Name</label>
                  <input type="text" placeholder="Enter customer name..." className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Phone Number</label>
                  <input type="text" placeholder="e.g. 0712345678" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 transition-all font-medium" />
                </div>
              </div>
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                <button onClick={() => setShowModal(false)} className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-white/80 transition-all">Cancel</button>
                <button 
                  onClick={() => { alert('🎉 Customer Added Successfully!'); setShowModal(false); }}
                  className="px-10 py-3 premium-gradient text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
                >
                  Save Customer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomersPage;

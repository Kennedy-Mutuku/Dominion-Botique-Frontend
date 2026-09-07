import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Scissors, 
  Users, 
  Receipt, 
  Settings, 
  LogOut,
  TrendingUp,
  Package,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggleSidebar', handleToggle);
    return () => window.removeEventListener('toggleSidebar', handleToggle);
  }, []);
  
  const role = user?.role || 'attendant';
  const isAdmin = role === 'admin';

  const menuItems = isAdmin ? [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <TrendingUp size={20} />, label: 'Reports', path: '/admin/reports' },
    { icon: <Package size={20} />, label: 'Inventory', path: '/admin/inventory' },
    { icon: <Scissors size={20} />, label: 'Tailoring', path: '/admin/tailoring' },
    { icon: <Users size={20} />, label: 'Customers', path: '/admin/customers' },
    { icon: <Receipt size={20} />, label: 'Expenses', path: '/admin/expenses' },
  ] : [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/staff/dashboard' },
    { icon: <Package size={20} />, label: 'Stock View', path: '/staff/inventory' },
    { icon: <Scissors size={20} />, label: 'Tailoring', path: '/staff/tailoring' },
    { icon: <Users size={20} />, label: 'Customers', path: '/staff/customers' },
  ];

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/10 backdrop-blur-[1px] z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container - Floating Dropdown style for Mobile (on the Right) */}
      <div className={`
        fixed right-0 top-[114px] bg-white border-l border-slate-100 flex flex-col z-40
        transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${isOpen 
          ? 'translate-x-0 w-60 h-auto max-h-[calc(100vh-140px)] rounded-bl-[2.5rem] shadow-2xl visible' 
          : 'translate-x-full invisible lg:hidden'}
      `}>
        <div className="p-5 border-b border-slate-50 bg-slate-50/50">
          <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] opacity-80">Management Menu</p>
        </div>

        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 opacity-60">Operations</p>
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 font-bold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
              `}
            >
              <span className="transition-transform group-hover:scale-110 scale-90">{item.icon}</span>
              <span className="text-[12px] tracking-tight">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-slate-50 bg-slate-50/30">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-all font-black text-[11px] uppercase tracking-wider border border-transparent hover:border-rose-100"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

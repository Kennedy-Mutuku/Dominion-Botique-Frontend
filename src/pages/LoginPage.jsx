import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const roleParam = searchParams.get('role') || 'attendant';
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isAdmin = roleParam === 'admin';

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password, roleParam);
    
    if (result.success) {
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/staff/dashboard');
      }
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <Header />
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/5 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="flex-1 flex items-center justify-center p-6 pt-32">
        <div className="w-full max-w-md fade-in">
          <div className="glass rounded-[2rem] p-6 md:p-8 border border-white shadow-2xl">
            <div className="text-center mb-6 flex flex-col items-center">
              <h1 className="text-2xl font-black text-slate-900 mb-1">
                {isAdmin ? 'Admin Portal' : 'Staff Portal'}
              </h1>
              <p className="text-slate-500 text-sm">Sign in to manage your boutique</p>
            </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-slate-500 group-hover:text-slate-800 transition-colors">Remember me</span>
              </label>
              <a href="#" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot Password?</a>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 premium-gradient text-white rounded-xl font-bold text-base shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all active:scale-[0.98] mt-2"
            >
              Log In to Dashboard
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-[11px] tracking-wide uppercase font-medium">
              Not {isAdmin ? 'an admin' : 'staff'}? {' '}
              <button 
                onClick={() => navigate(`/login?role=${isAdmin ? 'attendant' : 'admin'}`)}
                className="font-black text-slate-800 hover:text-blue-600 transition-colors underline underline-offset-4 decoration-blue-500/30"
              >
                Switch to {isAdmin ? 'Staff Portal' : 'Admin Portal'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default LoginPage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownLeft, ArrowUpRight, Activity, Package, TrendingUp, TrendingDown } from 'lucide-react';
import Header from '../components/Header';
import VideoBackground from '../components/VideoBackground';

const LandingPage = () => {
  const navigate = useNavigate();

  // State for data
  const [stock, setStock] = useState([]);
  const [sales, setSales] = useState([]);

  // State for dates
  const today = new Date().toISOString().split('T')[0];
  
  // Default fromDate to the 1st of the current month
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  
  const [fromDate, setFromDate] = useState(firstDayOfMonth);
  const [toDate, setToDate] = useState(today);

  // Load data on mount
  useEffect(() => {
    const savedStock = localStorage.getItem('lucy_stock');
    if (savedStock) setStock(JSON.parse(savedStock));
    
    const savedSales = localStorage.getItem('lucy_sales');
    if (savedSales) setSales(JSON.parse(savedSales));
  }, []);

  // Filter Logic
  const filteredStock = stock.filter(item => item.date >= fromDate && item.date <= toDate);
  const filteredSales = sales.filter(sale => sale.date >= fromDate && sale.date <= toDate);

  // Calculations
  const stockInValue = filteredStock.reduce((sum, item) => sum + (item.quantity * (item.buyingPrice || 0)), 0);
  const stockOutRevenue = filteredSales.reduce((sum, sale) => sum + (sale.soldPrice || 0), 0);
  const totalProfit = filteredSales.reduce((sum, sale) => sum + (sale.profit || 0), 0);

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white">
      <Header />
      
      <main className="pt-[140px] md:pt-[150px]">
        {/* Hero Section with Cinematic Background */}
        <section className="relative min-h-[calc(100vh-140px)] md:min-h-[calc(100vh-150px)] flex flex-col items-center justify-center overflow-hidden py-10 px-4">
          <VideoBackground />
          
          <div className="relative z-20 flex flex-col items-center w-full max-w-5xl">
            
            {/* Centered Action Buttons */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 w-full justify-center mb-8">
              
              {/* INFLOW Button */}
              <button 
                onClick={() => navigate('/inflow')}
                className="group w-full md:w-auto flex items-center justify-center gap-4 px-12 py-5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white transition-all duration-300 shadow-[0_8px_30px_rgba(244,63,94,0.4)] hover:shadow-[0_8px_40px_rgba(244,63,94,0.6)] hover:-translate-y-1 rounded-sm"
              >
                <span className="text-xs md:text-sm font-black uppercase tracking-[0.4em]">Inflow</span>
                <ArrowDownLeft size={20} className="opacity-80 group-hover:opacity-100 group-hover:-translate-x-1 group-hover:translate-y-1 transition-all duration-300" strokeWidth={2.5} />
              </button>

              {/* OUTFLOW Button */}
              <button 
                onClick={() => navigate('/outflow')}
                className="group w-full md:w-auto flex items-center justify-center gap-4 px-12 py-5 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white transition-all duration-300 shadow-[0_8px_30px_rgba(168,85,247,0.4)] hover:shadow-[0_8px_40px_rgba(168,85,247,0.6)] hover:-translate-y-1 rounded-sm"
              >
                <span className="text-xs md:text-sm font-black uppercase tracking-[0.4em]">Outflow</span>
                <ArrowUpRight size={20} className="opacity-80 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" strokeWidth={2.5} />
              </button>
              
            </div>

            {/* Dashboard Container - Thin & Subtle */}
            <div className="w-full max-w-4xl glass-dark rounded-sm p-3 md:p-4 shadow-lg border border-white/5 backdrop-blur-md bg-black/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Date Filters */}
                <div className="flex items-center gap-2 w-full md:w-auto bg-white/5 p-1.5 rounded-sm border border-white/5">
                  <div className="flex items-center px-2">
                    <span className="text-[9px] uppercase font-bold text-slate-400 mr-2 tracking-widest">From</span>
                    <input 
                      type="date" 
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="bg-transparent text-white text-xs font-medium focus:outline-none w-[105px]"
                    />
                  </div>
                  <div className="w-px h-4 bg-white/10"></div>
                  <div className="flex items-center px-2">
                    <span className="text-[9px] uppercase font-bold text-slate-400 mr-2 tracking-widest">To</span>
                    <input 
                      type="date" 
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="bg-transparent text-white text-xs font-medium focus:outline-none w-[105px]"
                    />
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="flex flex-row items-center justify-between md:justify-end gap-4 md:gap-8 w-full md:w-auto mt-2 md:mt-0 px-2 md:px-0">
                  
                  {/* Stock In */}
                  <div className="flex flex-col items-start">
                    <h3 className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-0.5">Stock In (Cost)</h3>
                    <p className="text-sm md:text-base font-black text-white">Ksh {stockInValue.toLocaleString()}</p>
                  </div>

                  <div className="w-px h-6 bg-white/10 hidden sm:block"></div>

                  {/* Stock Out */}
                  <div className="flex flex-col items-start">
                    <h3 className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-0.5">Stock Out (Rev)</h3>
                    <p className="text-sm md:text-base font-black text-white">Ksh {stockOutRevenue.toLocaleString()}</p>
                  </div>

                  <div className="w-px h-6 bg-white/10 hidden sm:block"></div>

                  {/* Profit/Loss */}
                  <div className="flex flex-col items-start">
                    <h3 className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-0.5">Profit / Loss</h3>
                    <p className={`text-sm md:text-base font-black ${totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {totalProfit >= 0 ? '+' : '-'}Ksh {Math.abs(totalProfit || 0).toLocaleString()}
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="absolute bottom-4 left-0 right-0 text-center z-20 pointer-events-none w-full">
            <p className="text-[10px] md:text-xs uppercase tracking-widest text-white/40 font-medium">
              Designed by <span className="font-bold text-white/70">Dominion Softwares</span> <span className="mx-2 opacity-50">|</span> Tel: 0740881485
            </p>
          </footer>
        </section>

      {/* Custom Styles for the scroll line animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scrollLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}} />
      </main>
    </div>
  );
};

export default LandingPage;

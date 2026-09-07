import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  Search, 
  Plus, 
  Minus,
  ShoppingCart, 
  Package, 
  User, 
  ChevronRight,
  Filter,
  CheckCircle2,
  Trash2,
  CreditCard,
  Wallet,
  ArrowRight
} from 'lucide-react';

import Header from '../components/Header';

const StaffDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState({}); // Tracking selection per product {productId: variantIndex}
  const [validationErrors, setValidationErrors] = useState({}); // Tracking errors per product {productId: true}

  // Load from LocalStorage to stay in sync with Inventory Page
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('nyakoe_inventory');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'PRD-001', name: 'Cotton Summer Dress', selling: 2500, stock: 15, category: 'Dresses', size: 'M' },
      { id: 'PRD-002', name: 'Men Silk Tie', selling: 1200, stock: 42, category: 'Accessories', size: 'One Size' },
      { id: 'PRD-003', name: 'Linen Trousers', selling: 3800, stock: 8, category: 'Pants', size: '34' },
      { id: 'PRD-004', name: 'Classic White Shirt', selling: 2200, stock: 25, category: 'Shirts', size: 'L' },
    ];
  });

  // Sync back to LocalStorage whenever products change (stock reduction)
  React.useEffect(() => {
    localStorage.setItem('nyakoe_inventory', JSON.stringify(products));
  }, [products]);

  const addToCart = (product) => {
    const sizeIndex = selectedSizes[product.id];
    let cartItemName = product.name;
    let sellingPrice = product.selling || product.price;
    let variantId = 'none';
    let availableStock = product.stock;

    if (product.variantsList && product.variantsList.length > 0) {
      if (sizeIndex === undefined) {
        setValidationErrors({...validationErrors, [product.id]: true});
        return;
      }
      const variant = product.variantsList[sizeIndex];
      cartItemName = `${product.name} (${variant.size})`;
      sellingPrice = variant.price;
      variantId = `${sizeIndex}`;
      availableStock = variant.qty;
    }

    const existingItemIdx = cart.findIndex(item => item.id === product.id && item.variantId === variantId);

    if (existingItemIdx > -1) {
      if (cart[existingItemIdx].quantity >= availableStock) {
        // Option: Show a subtle feedback or just block
        return; 
      }
      const newCart = [...cart];
      newCart[existingItemIdx].quantity += 1;
      setCart(newCart);
    } else {
      if (availableStock <= 0) return;
      const newItem = {
        ...product,
        cartName: cartItemName,
        sellingPrice: sellingPrice,
        variantId: variantId,
        quantity: 1,
        maxStock: availableStock
      };
      setCart([...cart, newItem]);
    }
  };

  const updateCartQty = (productId, variantId, delta) => {
    const newCart = cart.map(item => {
      if (item.id === productId && item.variantId === variantId) {
        const nextQty = item.quantity + delta;
        if (delta > 0 && nextQty > item.maxStock) return item;
        return nextQty > 0 ? { ...item, quantity: nextQty } : null;
      }
      return item;
    }).filter(Boolean);
    setCart(newCart);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
  const finalTotal = Math.max(0, total - discount);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Reduce Stock Logic
    const updatedProducts = products.map(p => {
      const itemsInCart = cart.filter(item => item.id === p.id).reduce((sum, item) => sum + item.quantity, 0);
      return { ...p, stock: Math.max(0, p.stock - itemsInCart) };
    });
    
    setProducts(updatedProducts);
    alert(`🎉 Dispatch Successful!\nFinal Total: KSh ${finalTotal.toLocaleString()}\nDiscount Applied: KSh ${discount.toLocaleString()}\n\nStock levels have been automatically reduced.`);
    setCart([]);
    setDiscount(0);
  };

  return (
    <div className="bg-slate-50 min-h-screen relative overflow-x-hidden">
      <Header />
      <Sidebar />
      
      <main className="flex-1 w-full p-3 md:p-8 pt-44 lg:pt-40 grid lg:grid-cols-3 gap-6 md:gap-8 overflow-x-hidden">
        {/* Main Recording Area */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8 max-w-full">
          <header className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">New Sale Recording</h1>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Nyakoe Retail Interface</p>
            </div>
          </header>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-11 pr-4 py-3.5 md:py-4 bg-white border border-slate-200 rounded-[2rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm md:text-base"
              />
            </div>
            <button 
              onClick={() => alert('Filter feature coming soon!')}
              className="w-full md:w-auto px-6 py-4 bg-white border border-slate-200 rounded-[2rem] text-slate-600 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>
          </div>

          {/* Product Grid (High Density) - Only showing items with stock */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {products
              .filter(p => p.stock > 0)
              .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((product) => (
              <div key={product.id} className="bg-white rounded-[1.5rem] shadow-lg shadow-slate-200/40 border border-slate-100 overflow-hidden flex flex-col group hover:border-blue-500/50 transition-all">
                {/* Visual Area (More Compact) */}
                <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <Package size={32} strokeWidth={1} />
                    </div>
                  )}
                  {/* Stock Badge (Slim) */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/90 backdrop-blur-md rounded-full border border-slate-100 shadow-sm">
                    <p className={`text-[8px] font-black uppercase tracking-tight ${product.stock > 10 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {product.stock} IN STOCK
                    </p>
                  </div>
                  {/* Category Chip (Mini) */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/10 backdrop-blur-md rounded-lg border border-white/20">
                    <p className="text-[7px] font-black text-slate-700 uppercase tracking-widest">{product.category}</p>
                  </div>
                </div>

                {/* Content Area (High Density) */}
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tight mb-2">{product.name}</h3>
                  
                  {product.variantsList && product.variantsList.length > 0 ? (
                    <div className="mb-3 space-y-1.5">
                      <div className="flex justify-between items-center px-0.5">
                        <label className={`text-[8px] font-black uppercase tracking-widest ${validationErrors[product.id] ? 'text-rose-500' : 'text-slate-400'}`}>
                          Size *
                        </label>
                        {validationErrors[product.id] && (
                          <span className="text-[7px] font-black text-rose-500 uppercase animate-pulse">Required</span>
                        )}
                      </div>
                      <select 
                        value={selectedSizes[product.id] ?? ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? undefined : parseInt(e.target.value);
                          setSelectedSizes({...selectedSizes, [product.id]: val});
                          if (val !== undefined) {
                            const newErrors = {...validationErrors};
                            delete newErrors[product.id];
                            setValidationErrors(newErrors);
                          }
                        }}
                        className={`w-full px-2 py-1.5 bg-slate-50 border rounded-lg text-[10px] font-black transition-all appearance-none cursor-pointer ${
                          validationErrors[product.id] 
                          ? 'border-rose-500 bg-rose-50/30 text-rose-700' 
                          : 'border-slate-200 text-slate-700 focus:ring-4 focus:ring-blue-500/10'
                        }`}
                      >
                        <option value="">-- Choose --</option>
                        {product.variantsList.map((v, vIdx) => (
                          <option key={vIdx} value={vIdx}>
                            {v.size} - KSh {v.price.toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="mb-3 h-[38px] flex items-center">
                       <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest">Size: {product.size || 'N/A'}</p>
                    </div>
                  )}
                  
                  <div className="mt-auto pt-2 border-t border-slate-50 flex justify-between items-center">
                    <div>
                      <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Price</p>
                      <span className="text-xs font-black text-slate-900">
                        KSh {
                          product.variantsList && selectedSizes[product.id] !== undefined
                          ? product.variantsList[selectedSizes[product.id]].price.toLocaleString()
                          : (product.selling || product.price).toLocaleString()
                        }
                      </span>
                    </div>
                    <button 
                      onClick={() => addToCart(product)}
                      disabled={product.stock <= 0}
                      className={`p-1.5 rounded-lg transition-all active:scale-95 ${
                        product.stock > 0 
                        ? 'bg-slate-900 text-white hover:bg-blue-600 shadow-md' 
                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-32 overflow-hidden">
            <div className="p-5 border-b border-slate-50 bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg text-white">
                  <ShoppingCart size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Active Cart</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cart.length} Items</p>
                </div>
              </div>
            </div>

            <div className="p-4 min-h-[300px]">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 py-10">
                  <ShoppingCart size={40} strokeWidth={1} className="mb-3 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Ready for Sale</p>
                </div>
              ) : (
                <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2">
                    {cart.map((item, idx) => (
                      <div key={`${item.id}-${item.variantId || idx}`} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex-shrink-0 overflow-hidden border border-slate-50">
                          {item.image ? <img src={item.image} alt="" className="w-full h-full object-contain" /> : <Package className="w-full h-full p-3 text-slate-300" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-black text-slate-900 truncate uppercase tracking-tight">{item.cartName || item.name}</h4>
                          <p className="text-[10px] font-bold text-blue-600">KSh {item.sellingPrice?.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-100">
                          <button 
                            onClick={() => updateCartQty(item.id, item.variantId, -1)}
                            className="w-6 h-6 flex items-center justify-center bg-white text-slate-600 rounded-md shadow-sm hover:text-rose-500 transition-all"
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <span className="text-[10px] font-black text-slate-900 min-w-[12px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQty(item.id, item.variantId, 1)}
                            disabled={item.quantity >= item.maxStock}
                            className={`w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm transition-all ${
                              item.quantity >= item.maxStock 
                              ? 'text-slate-200 cursor-not-allowed' 
                              : 'text-slate-600 hover:text-blue-600'
                            }`}
                          >
                            <Plus size={12} strokeWidth={3} />
                          </button>
                        </div>
                        <button 
                          onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                          className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="p-5 border-t border-slate-50 space-y-4 bg-slate-50/30">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Optional Discount (KSh)</label>
                  <input 
                    type="number" 
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-black text-rose-600 focus:ring-4 focus:ring-rose-500/5 focus:border-rose-300 transition-all"
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-3 border-t border-slate-100 pt-5">
                    <div className="flex justify-between items-center text-slate-400">
                      <span className="text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                      <span className="text-xs font-black">KSh {cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0).toLocaleString()}</span>
                    </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                      <span>Discount</span>
                      <span>- KSh {discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-black text-slate-900 tracking-tight pt-1">
                    <span>Final Total</span>
                    <span className="text-blue-600">KSh {finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {['cash', 'm-pesa'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      paymentMethod === method 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
                        : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              <button 
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all ${
                  cart.length > 0
                    ? 'bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-900/10'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Complete Sale</span>
                <CheckCircle2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;

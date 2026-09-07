import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  AlertTriangle,
  ArrowUpDown,
  Download,
  Trash2,
  Edit3,
  Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const InventoryPage = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [variants, setVariants] = useState([]);
  const [newSize, setNewSize] = useState('');
  const [newQty, setNewQty] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Initial Data
  const initialItems = [
    { id: 'PRD-001', name: 'Cotton Summer Dress', category: 'Dresses', buying: 1500, selling: 2500, stock: 15, supplier: 'Global Textiles' },
    { id: 'PRD-002', name: 'Men Silk Tie', category: 'Accessories', buying: 500, selling: 1200, stock: 42, supplier: 'Silk Road' },
    { id: 'PRD-003', name: 'Linen Trousers', category: 'Pants', buying: 2200, selling: 3800, stock: 8, supplier: 'Quality Linens' },
    { id: 'PRD-004', name: 'Classic White Shirt', category: 'Shirts', buying: 1200, selling: 2200, stock: 25, supplier: 'Shirt Co.' },
    { id: 'PRD-005', name: 'School Uniform Set', category: 'Uniforms', buying: 1800, selling: 3500, stock: 5, supplier: 'Local Garments' },
  ];

  const [inventoryData, setInventoryData] = useState(() => {
    const saved = localStorage.getItem('nyakoe_inventory');
    return saved ? JSON.parse(saved) : initialItems;
  });

  // Sync with LocalStorage
  React.useEffect(() => {
    localStorage.setItem('nyakoe_inventory', JSON.stringify(inventoryData));
  }, [inventoryData]);

  // Form States
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Dresses');
  const [prodSupplier, setProdSupplier] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [prodImage, setProdImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProdImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addVariant = () => {
    if (newSize && newQty && newPrice) {
      setVariants([...variants, { 
        size: newSize, 
        qty: parseInt(newQty), 
        price: parseInt(newPrice) 
      }]);
      setNewSize('');
      setNewQty('');
      setNewPrice('');
    }
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const totalStock = variants.reduce((sum, v) => sum + v.qty, 0);

  const handleSaveProduct = () => {
    const errors = {};
    if (!prodName) errors.name = true;
    if (!buyingPrice) errors.buying = true;
    if (!sellingPrice) errors.selling = true;
    if (!prodImage) errors.image = true;
    if (!prodCategory) errors.category = true;
    if (!prodSupplier) errors.supplier = true;
    if (variants.length === 0) errors.variants = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newProduct = {
      id: `PRD-00${inventoryData.length + 1}`,
      name: prodName,
      category: prodCategory,
      buying: parseInt(buyingPrice),
      selling: parseInt(sellingPrice),
      stock: totalStock,
      supplier: prodSupplier,
      image: prodImage,
      variantsList: variants
    };

    setInventoryData([newProduct, ...inventoryData]);
    setShowModal(false);
    
    // Reset Form
    setProdName('');
    setProdSupplier('');
    setBuyingPrice('');
    setSellingPrice('');
    setVariants([]);
    setProdImage(null);
    setFormErrors({});
    
    alert('🎉 Product Successfully Added to Digital Vault!');
  };

  const totalProductsCount = inventoryData.length;
  const totalInventoryValue = inventoryData.reduce((sum, item) => sum + (item.selling * item.stock), 0);
  const lowStockCount = inventoryData.filter(item => item.stock < 10).length;

  return (
    <div className="bg-slate-50 min-h-screen relative overflow-x-hidden">
      <Header />
      <Sidebar />
      
      <main className="w-full p-3 md:p-8 pt-44 lg:pt-40 overflow-x-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">Inventory Management</h1>
            <p className="text-slate-500 font-bold mt-0.5 text-xs md:text-sm tracking-tight">Manage stock, prices, and suppliers professionally.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => alert('Inventory CSV Export started...')}
              className="px-4 py-2 text-xs bg-white border border-slate-200 text-slate-600 rounded-xl font-black flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
            {user?.role === 'attendant' && (
              <button 
                onClick={() => setShowModal(true)}
                className="px-5 py-2 text-xs premium-gradient text-white rounded-xl font-black flex items-center gap-2 shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all active:scale-95"
              >
                <Plus size={16} />
                <span>Add Product</span>
              </button>
            )}
          </div>
        </header>

        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Products', value: totalProductsCount.toLocaleString(), icon: <Package size={20} className="text-blue-500" />, color: 'bg-blue-50' },
            { label: 'Total Value', value: `KSh ${(totalInventoryValue / 1000000).toFixed(1)}M`, icon: <Package size={20} className="text-emerald-500" />, color: 'bg-emerald-50' },
            { label: 'Low Stock Items', value: lowStockCount.toString(), icon: <AlertTriangle size={20} className="text-rose-500" />, color: 'bg-rose-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className={`w-11 h-11 ${stat.color} rounded-xl flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                <h3 className="text-xl font-black text-slate-900 mt-1">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row gap-2 items-center">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-bold"
            />
          </div>
          <button className="px-4 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-100 transition-all border border-transparent">
            <Filter size={16} />
            <span>Category</span>
          </button>
          <button className="px-4 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-100 transition-all border border-transparent">
            <ArrowUpDown size={16} />
            <span>Sort by</span>
          </button>
        </div>

        {/* Inventory Table (Desktop) / Cards (Mobile) */}
        <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Product</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Supplier</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Buying Price</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Selling Price</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Stock</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-6 py-3 w-20 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {inventoryData.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase())).map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-bold overflow-hidden">
                          {row.image ? (
                            <img src={row.image} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <Package size={18} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">{row.name}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{row.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[8px] font-black uppercase tracking-widest">
                        {row.category}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                        {row.supplier || 'Direct'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs text-slate-500 font-bold">KSh {row.buying.toLocaleString()}</td>
                    <td className="px-6 py-3 text-sm text-slate-900 font-black">KSh {row.selling.toLocaleString()}</td>
                    <td className="px-6 py-3">
                      <span className="text-sm font-black text-slate-900">{row.stock}</span>
                      <span className="text-slate-400 text-[10px] font-bold ml-1 uppercase">qty</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        row.stock < 10 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {row.stock < 10 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {user?.role === 'attendant' ? (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <Edit3 size={14} />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-60">Read Only View</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-slate-50">
            {inventoryData.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase())).map((row) => (
              <div key={row.id} className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{row.name}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    row.stock < 10 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {row.stock} Units
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Price</p>
                    <p className="text-sm font-black text-slate-900">KSh {row.selling.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Category</p>
                    <p className="text-xs font-bold text-slate-600 uppercase">{row.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Product Modal (Sleek & Compact) */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-3xl max-h-[95vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col fade-in">
              {/* Modal Header */}
              <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div>
                  <h2 className="text-lg md:text-xl font-black text-slate-900 leading-tight">New Stock Entry</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Initialize product specifications</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all">✕</button>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="flex-1 overflow-y-auto p-5 md:p-7">
                <div className="space-y-6">
                  {/* Section 1: Core Product Identity */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${formErrors.name ? 'text-rose-500' : 'text-slate-400'}`}>
                        Product Identity *
                      </label>
                      {formErrors.name && <span className="text-[9px] font-black text-rose-500 uppercase animate-pulse">Required *</span>}
                    </div>
                    <input 
                      type="text" 
                      required
                      value={prodName}
                      onChange={(e) => {
                        setProdName(e.target.value);
                        if(e.target.value) {
                          const newErrs = {...formErrors};
                          delete newErrs.name;
                          setFormErrors(newErrs);
                        }
                      }}
                      placeholder="e.g., Luxury Silk Evening Gown" 
                      className={`w-full px-5 py-3.5 border rounded-2xl transition-all font-black text-base placeholder:font-bold placeholder:text-slate-300 ${
                        formErrors.name 
                        ? 'border-rose-500 bg-rose-50/30 text-rose-700 ring-4 ring-rose-500/10' 
                        : 'bg-slate-50 border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-50'
                      }`} 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left: Media & Basic Info (5 cols) */}
                    <div className="md:col-span-5 space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center px-1">
                          <label className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${formErrors.image ? 'text-rose-500' : 'text-slate-400'}`}>
                            Visual Representation *
                          </label>
                        </div>
                        <input 
                          type="file" 
                          id="photo-upload" 
                          className="hidden" 
                          accept="image/*" 
                          capture="environment" 
                          onChange={(e) => {
                            handleImageChange(e);
                            const newErrs = {...formErrors};
                            delete newErrs.image;
                            setFormErrors(newErrs);
                          }}
                        />
                        <label 
                          htmlFor="photo-upload"
                          className={`aspect-square border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-3 group transition-all cursor-pointer overflow-hidden relative ${
                            formErrors.image 
                            ? 'border-rose-500 bg-rose-50/30' 
                            : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
                          }`}
                        >
                          {prodImage ? (
                            <img src={prodImage} alt="Preview" className="w-full h-full object-contain p-2" />
                          ) : (
                            <>
                              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-all">
                                <Plus size={24} />
                              </div>
                              <div className="text-center px-4">
                                <p className="text-xs font-black text-slate-900 leading-tight">Upload Photo</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1">PNG, JPG, Camera</p>
                              </div>
                            </>
                          )}
                          <div className="absolute bottom-4 right-4 p-2.5 bg-white shadow-lg rounded-xl text-slate-400 group-hover:text-blue-500 transition-all">
                            <Camera size={16} />
                          </div>
                        </label>
                      </div>

                        <div className="space-y-4 bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center px-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest ${formErrors.category ? 'text-rose-500' : 'text-slate-400'}`}>Category *</label>
                            {formErrors.category && <span className="text-[8px] font-black text-rose-500 uppercase">Required *</span>}
                          </div>
                          <select 
                            required 
                            value={prodCategory}
                            onChange={(e) => {
                              setProdCategory(e.target.value);
                              const newErrs = {...formErrors};
                              delete newErrs.category;
                              setFormErrors(newErrs);
                            }}
                            className={`w-full px-4 py-2.5 border rounded-xl transition-all font-bold text-xs appearance-none cursor-pointer ${
                              formErrors.category ? 'border-rose-500 bg-rose-50/30' : 'bg-white border-slate-200'
                            }`}
                          >
                            <option value="">Select Category</option>
                            <option>Dresses</option>
                            <option>Suits</option>
                            <option>Shirts</option>
                            <option>Pants</option>
                            <option>Accessories</option>
                            <option>Footwear</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center px-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest ${formErrors.supplier ? 'text-rose-500' : 'text-slate-400'}`}>Supplier *</label>
                            {formErrors.supplier && <span className="text-[8px] font-black text-rose-500 uppercase">Required *</span>}
                          </div>
                          <input 
                            type="text" 
                            required 
                            value={prodSupplier}
                            onChange={(e) => {
                              setProdSupplier(e.target.value);
                              if(e.target.value) {
                                const newErrs = {...formErrors};
                                delete newErrs.supplier;
                                setFormErrors(newErrs);
                              }
                            }}
                            placeholder="Supplier name..." 
                            className={`w-full px-4 py-2.5 border rounded-xl transition-all font-bold text-xs ${
                              formErrors.supplier ? 'border-rose-500 bg-rose-50/30' : 'bg-white border-slate-200'
                            }`} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right: Pricing & Variants (7 cols) */}
                    <div className="md:col-span-7 space-y-6">
                      <div className="grid grid-cols-2 gap-3">
                          <div className={`p-4 border rounded-2xl space-y-1 transition-all ${
                            formErrors.buying 
                            ? 'border-rose-500 bg-rose-50/30' 
                            : 'bg-emerald-50/30 border-emerald-100'
                          }`}>
                            <p className={`text-[9px] font-black uppercase tracking-widest ${formErrors.buying ? 'text-rose-600' : 'text-emerald-600'}`}>Buy Price {formErrors.buying && '*'}</p>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-black whitespace-nowrap flex-shrink-0 ${formErrors.buying ? 'text-rose-600/60' : 'text-emerald-600/60'}`}>KSh</span>
                              <input 
                                type="number" 
                                required 
                                value={buyingPrice}
                                onChange={(e) => {
                                  setBuyingPrice(e.target.value);
                                  if(e.target.value) {
                                    const newErrs = {...formErrors};
                                    delete newErrs.buying;
                                    setFormErrors(newErrs);
                                  }
                                }}
                                placeholder="0" 
                                className={`w-full bg-transparent border-none p-0 focus:ring-0 text-base font-black placeholder:text-emerald-200 ${formErrors.buying ? 'text-rose-700' : 'text-emerald-700'}`} 
                              />
                            </div>
                          </div>
                          <div className={`p-4 border rounded-2xl space-y-1 transition-all ${
                            formErrors.selling 
                            ? 'border-rose-500 bg-rose-50/30' 
                            : 'bg-blue-50/30 border-blue-100'
                          }`}>
                            <p className={`text-[9px] font-black uppercase tracking-widest ${formErrors.selling ? 'text-rose-600' : 'text-blue-600'}`}>Sell Price {formErrors.selling && '*'}</p>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-black whitespace-nowrap flex-shrink-0 ${formErrors.selling ? 'text-rose-600/60' : 'text-blue-600/60'}`}>KSh</span>
                              <input 
                                type="number" 
                                required 
                                value={sellingPrice}
                                onChange={(e) => {
                                  setSellingPrice(e.target.value);
                                  if(e.target.value) {
                                    const newErrs = {...formErrors};
                                    delete newErrs.selling;
                                    setFormErrors(newErrs);
                                  }
                                }}
                                placeholder="0" 
                                className={`w-full bg-transparent border-none p-0 focus:ring-0 text-base font-black placeholder:text-blue-200 ${formErrors.selling ? 'text-rose-700' : 'text-blue-700'}`} 
                              />
                            </div>
                          </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-end px-1">
                          <label className={`text-[9px] font-black uppercase tracking-widest ${formErrors.variants ? 'text-rose-500' : 'text-slate-400'}`}>
                            Size Variants *
                          </label>
                          <span className="text-[9px] font-black text-blue-600 uppercase">Stock: {totalStock}</span>
                        </div>
                        
                        <div className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all ${formErrors.variants ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-slate-200'}`}>
                          <div className="p-3 bg-slate-50 border-b border-slate-200 grid grid-cols-4 gap-2">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Size</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Qty</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Price</p>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-right">Action</p>
                          </div>
                          
                          <div className="max-h-[160px] overflow-y-auto divide-y divide-slate-100">
                            <div className="p-3 grid grid-cols-4 gap-2 items-center bg-blue-50/5">
                              <select 
                                value={newSize}
                                onChange={(e) => setNewSize(e.target.value)}
                                className="bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-[11px] font-black w-full"
                              >
                                <option value="">S</option>
                                <option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option>
                                <option>28</option><option>30</option><option>32</option><option>34</option><option>36</option><option>38</option><option>40</option><option>42</option>
                              </select>
                              <input 
                                type="number" 
                                value={newQty}
                                onChange={(e) => setNewQty(e.target.value)}
                                placeholder="0" 
                                className="bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-[11px] font-bold w-full" 
                              />
                              <input 
                                type="number" 
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                                placeholder="0" 
                                className="bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-[11px] font-bold w-full" 
                              />
                              <button 
                                onClick={addVariant}
                                className="w-full bg-slate-900 text-white rounded-lg py-1.5 text-[8px] font-black uppercase hover:bg-blue-600 transition-all"
                              >
                                Add
                              </button>
                            </div>

                            {variants.map((v, idx) => (
                              <div key={idx} className="p-3 grid grid-cols-4 gap-2 items-center hover:bg-slate-50 transition-colors">
                                <span className="text-[11px] font-black text-slate-700 uppercase">{v.size}</span>
                                <span className="text-[11px] font-bold text-blue-600">{v.qty}</span>
                                <span className="text-[11px] font-black text-emerald-600">KSh {Number(v.price).toLocaleString()}</span>
                                <div className="flex justify-end">
                                  <button onClick={() => removeVariant(idx)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 md:p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 z-10">
                <button onClick={() => setShowModal(false)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-black text-[10px] hover:bg-white/80 transition-all uppercase tracking-widest">Cancel</button>
                <button 
                  onClick={handleSaveProduct}
                  className="px-8 py-2.5 premium-gradient text-white rounded-xl font-black text-[10px] shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all uppercase tracking-[0.2em]"
                >
                  Initialize Stock
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default InventoryPage;

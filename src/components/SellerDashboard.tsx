import React, { useState } from 'react';
import { 
  Store, 
  Plus, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Check, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, OrderStatus, CategoryType } from '../types';

export const SellerDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDefaultProducts,
    orders,
    updateOrderStatus,
    deleteOrder,
    setActiveTab,
    shopName,
    setShopName,
    shopTagline,
    setShopTagline
  } = useShop();

  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'products'>('orders');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [isEditingShopName, setIsEditingShopName] = useState(false);
  const [customShopNameInput, setCustomShopNameInput] = useState(shopName);
  const [customTaglineInput, setCustomTaglineInput] = useState(shopTagline);

  // Add / Edit Product Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields for product
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOriginalPrice, setProdOriginalPrice] = useState('');
  const [prodCategory, setProdCategory] = useState<CategoryType>('Electronics');
  const [prodImage, setProdImage] = useState('');
  const [prodStock, setProdStock] = useState('25');
  const [prodBrand, setProdBrand] = useState('Local Brand PK');
  const [prodSku, setProdSku] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodIsBioscience, setProdIsBioscience] = useState(false);

  // Quick image presets for seller convenience
  const PRESET_IMAGES = [
    { label: 'Leather Bag', url: '/src/assets/images/product_leather_bag_1793795962612.jpg' },
    { label: 'Wireless Earbuds', url: '/src/assets/images/product_wireless_earbuds_1793795963572.jpg' },
    { label: 'Smart Watch', url: '/src/assets/images/product_smart_watch_1793795964018.jpg' },
    { label: 'Lab Microscope', url: '/src/assets/images/product_lab_microscope_1793795964336.jpg' },
    { label: 'Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80' },
    { label: 'Lawn Kurti', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80' }
  ];

  // Financial Analytics
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.total : sum), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const inStockProductsCount = products.filter(p => p.stock > 0).length;

  const openAddModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdPrice('');
    setProdOriginalPrice('');
    setProdCategory('Electronics');
    setProdImage(PRESET_IMAGES[0].url);
    setProdStock('20');
    setProdBrand('Daraz Merchant PK');
    setProdSku(`SKU-PK-${Math.floor(1000 + Math.random() * 9000)}`);
    setProdDesc('High quality product with original warranty and fast cash on delivery shipment across Pakistan.');
    setProdIsBioscience(false);
    setIsProductModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdPrice(p.price.toString());
    setProdOriginalPrice(p.originalPrice ? p.originalPrice.toString() : '');
    setProdCategory(p.category as CategoryType);
    setProdImage(p.image);
    setProdStock(p.stock.toString());
    setProdBrand(p.brand || '');
    setProdSku(p.sku || '');
    setProdDesc(p.description);
    setProdIsBioscience(p.isBioscience || false);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(prodPrice) || 0;
    const origPriceNum = prodOriginalPrice ? Number(prodOriginalPrice) : undefined;
    const stockNum = Number(prodStock) || 0;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: prodName,
        price: priceNum,
        originalPrice: origPriceNum,
        category: prodCategory,
        image: prodImage || PRESET_IMAGES[0].url,
        stock: stockNum,
        brand: prodBrand,
        sku: prodSku,
        description: prodDesc,
        isBioscience: prodIsBioscience
      });
    } else {
      addProduct({
        name: prodName,
        price: priceNum,
        originalPrice: origPriceNum,
        category: prodCategory,
        image: prodImage || PRESET_IMAGES[0].url,
        stock: stockNum,
        brand: prodBrand,
        sku: prodSku,
        description: prodDesc,
        isBioscience: prodIsBioscience,
        sellerName: 'My Official Daraz Store'
      });
    }

    setIsProductModalOpen(false);
  };

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.callPhone.includes(orderSearch) ||
      o.customer.whatsappNumber.includes(orderSearch) ||
      o.customer.city.toLowerCase().includes(orderSearch.toLowerCase());

    const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Seller Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-400 mb-1">
            <Store className="w-4 h-4" /> Daraz Seller Center · {shopName}
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {shopName} — Seller Dashboard
            </h1>
            <button
              onClick={() => {
                setCustomShopNameInput(shopName);
                setCustomTaglineInput(shopTagline);
                setIsEditingShopName(!isEditingShopName);
              }}
              className="p-1.5 text-xs bg-white/10 hover:bg-white/20 text-orange-300 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              title="Dukan ka Naya Naam Rekhein"
            >
              <Edit3 className="w-3.5 h-3.5" /> Rename Shop
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {shopTagline} · Manage your store inventory, add new products, inspect customer orders with 2 phone numbers (Call & WhatsApp) and landmarks.
          </p>

          {/* Quick inline rename bar if opened */}
          {isEditingShopName && (
            <div className="mt-3 p-3 bg-white/10 backdrop-blur-xs rounded-xl border border-white/20 max-w-lg space-y-2 animate-in fade-in">
              <span className="text-[11px] font-bold text-orange-300 block">Dukan ka Naya Naam Rekhein:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customShopNameInput}
                  onChange={(e) => setCustomShopNameInput(e.target.value)}
                  placeholder="Dukan ka naya naam..."
                  className="px-3 py-1.5 bg-slate-950 border border-slate-600 rounded-lg text-xs text-white flex-1 focus:outline-hidden focus:border-[#f85606]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customShopNameInput.trim()) {
                      setShopName(customShopNameInput.trim());
                      setShopTagline(customTaglineInput.trim() || 'Daraz.pk Verified Seller & Online Store');
                      setIsEditingShopName(false);
                    }
                  }}
                  className="px-3 py-1.5 bg-[#f85606] hover:bg-[#e04d05] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Save Name
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingShopName(false)}
                  className="px-2.5 py-1.5 bg-white/10 text-slate-300 hover:text-white text-xs rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-[#f85606] hover:bg-[#e04d05] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add New Product (Product Dalein)
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap"
          >
            View Customer Store
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Sales Revenue
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
              Rs. {totalRevenue.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              PKR
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Customer Orders
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
              {totalOrdersCount}
            </span>
            <span className="text-xs font-medium text-slate-500">Orders</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Pending Orders (Need Verification)
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-xl sm:text-2xl font-black text-[#f85606] tabular-nums">
              {pendingOrdersCount}
            </span>
            <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
              Action Required
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Active Store Catalog
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
              {inStockProductsCount}
            </span>
            <span className="text-xs font-medium text-emerald-600">In Stock</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Orders vs Products */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`pb-3 px-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'orders'
              ? 'border-[#f85606] text-[#f85606]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Customer Orders Management ({orders.length})
        </button>

        <button
          onClick={() => setActiveSubTab('products')}
          className={`pb-3 px-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'products'
              ? 'border-[#f85606] text-[#f85606]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          Products Catalog & Inventory ({products.length})
        </button>
      </div>

      {/* SUBTAB 1: ORDERS MANAGEMENT */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          {/* Order Search & Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search by Order ID, Customer Name, Call Phone or City..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders Cards List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400">
              <ShoppingBag className="w-12 h-12 stroke-1 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No orders matching your criteria</p>
              <p className="text-xs text-slate-500 mt-1">When customers place orders from the store, they appear here instantly.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const rawNum = order.customer.whatsappNumber.replace(/[^0-9]/g, '');
                const waNumber = rawNum.startsWith('0') ? `92${rawNum.slice(1)}` : rawNum;
                const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Assalam-o-Alaikum ${order.customer.fullName}! Thank you for your Daraz order #${order.id}. We are preparing your shipment.`)}`;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all hover:border-slate-300"
                  >
                    {/* Order Top Bar */}
                    <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-300 text-xs">
                          {order.id}
                        </span>
                        <span className="text-slate-500">
                          {new Date(order.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="font-bold text-[#f85606] uppercase">
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : order.paymentMethod.toUpperCase()}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-600">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className={`font-bold px-3 py-1.5 rounded-lg border text-xs cursor-pointer ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : order.status === 'Dispatched' || order.status === 'Out for Delivery'
                              ? 'bg-blue-50 text-blue-700 border-blue-300'
                              : order.status === 'Confirmed'
                              ? 'bg-purple-50 text-purple-700 border-purple-300'
                              : order.status === 'Cancelled'
                              ? 'bg-red-50 text-red-700 border-red-300'
                              : 'bg-amber-50 text-amber-700 border-amber-300'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 transition-colors ml-1"
                          title="Delete Order Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Order Body: Customer Contact, 2 Numbers, Landmark */}
                    <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                      {/* Customer Details & 2 Numbers */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Customer Information
                        </span>
                        <div className="text-sm font-bold text-slate-900">
                          {order.customer.fullName}
                        </div>

                        {/* Call Number with Call Action */}
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                          <div>
                            <span className="text-[10px] text-slate-400 block">Call Number (Calling)</span>
                            <a
                              href={`tel:${order.customer.callPhone}`}
                              className="font-mono font-bold text-blue-700 hover:underline"
                            >
                              {order.customer.callPhone}
                            </a>
                          </div>
                        </div>

                        {/* WhatsApp Number with One-Click Chat */}
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <span className="text-[10px] text-slate-400 block">WhatsApp Number</span>
                            <span className="font-mono font-bold text-emerald-700">
                              {order.customer.whatsappNumber}
                            </span>
                          </div>
                        </div>

                        {/* Action WhatsApp Button */}
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-2xs transition-colors mt-2"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-white" />
                          Chat on WhatsApp
                        </a>
                      </div>

                      {/* Delivery Address & Famous Landmark */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Delivery Location
                        </span>
                        <div className="font-medium text-slate-800">
                          {order.customer.address}
                        </div>
                        <div className="text-slate-600">
                          {order.customer.area}, <b className="text-slate-900">{order.customer.city}</b>, {order.customer.province}
                        </div>

                        {/* Famous Landmark Highlight */}
                        <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 mt-2">
                          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px] mb-0.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-700" />
                            Famous Landmark (Mashhur Jagah):
                          </div>
                          <span className="font-semibold text-amber-950">
                            {order.customer.famousLandmark}
                          </span>
                        </div>

                        {order.customer.deliveryInstructions && (
                          <div className="text-[11px] text-slate-500 italic">
                            Note: "{order.customer.deliveryInstructions}"
                          </div>
                        )}
                      </div>

                      {/* Ordered Items & Financial Summary */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Ordered Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                        </span>
                        <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-slate-50 p-1.5 rounded">
                              <span className="truncate max-w-[150px] font-medium text-slate-800">
                                {it.quantity}x {it.product.name}
                              </span>
                              <span className="font-bold text-slate-900 tabular-nums">
                                Rs. {(it.product.price * it.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-slate-200 space-y-0.5 text-xs">
                          <div className="flex justify-between text-slate-500">
                            <span>Subtotal:</span>
                            <span className="tabular-nums">Rs. {order.subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-slate-500">
                            <span>Delivery:</span>
                            <span>{order.deliveryFee === 0 ? 'FREE' : `Rs. ${order.deliveryFee}`}</span>
                          </div>
                          <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-1 border-t border-slate-100">
                            <span>Total Payable:</span>
                            <span className="text-[#f85606] tabular-nums">
                              Rs. {order.total.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: PRODUCTS MANAGEMENT */}
      {activeSubTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Manage Products Catalog ({products.length} Items)
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={resetToDefaultProducts}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                title="Restore default catalog items"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Defaults
              </button>
              <button
                onClick={openAddModal}
                className="px-3.5 py-1.5 bg-[#f85606] hover:bg-[#e04d05] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Original Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Brand / SKU</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                          />
                          <div className="max-w-xs">
                            <span className="font-bold text-slate-900 block truncate">{p.name}</span>
                            <span className="text-[10px] text-slate-400">ID: {p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-slate-600">
                        {p.category}
                        {p.isBioscience && (
                          <span className="block text-[10px] font-bold text-blue-600">Lab Grade</span>
                        )}
                      </td>
                      <td className="p-3 font-bold text-[#f85606] tabular-nums">
                        Rs. {p.price.toLocaleString()}
                      </td>
                      <td className="p-3 text-slate-400 tabular-nums">
                        {p.originalPrice ? `Rs. ${p.originalPrice.toLocaleString()}` : '-'}
                      </td>
                      <td className="p-3">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[11px] tabular-nums ${
                            p.stock > 10
                              ? 'bg-emerald-50 text-emerald-700'
                              : p.stock > 0
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">
                        {p.brand || 'No Brand'} / {p.sku || '-'}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-slate-500 hover:text-[#f85606] hover:bg-slate-100 rounded transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#f85606]" />
                <h3 className="font-bold text-base">
                  {editingProduct ? 'Edit Store Product' : 'Add New Product to Daraz Store'}
                </h3>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Product Title (Product ka Naam) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Pure Leather Messenger Bag, Wireless Earbuds, Lab Microscope"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Selling Price (Rs. PKR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="3500"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-[#f85606]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Original Price / M.R.P (Optional - For Discount %)
                  </label>
                  <input
                    type="number"
                    value={prodOriginalPrice}
                    onChange={(e) => setProdOriginalPrice(e.target.value)}
                    placeholder="4999"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as CategoryType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Men's Fashion">Men's Fashion</option>
                    <option value="Women's Fashion">Women's Fashion</option>
                    <option value="Shoes & Bags">Shoes & Bags</option>
                    <option value="Bioscience & Lab Supplies">Bioscience & Lab Supplies</option>
                    <option value="Health & Beauty">Health & Beauty</option>
                    <option value="Home & Lifestyle">Home & Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Stock Quantity (Available Pieces)
                  </label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    placeholder="25"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                    placeholder="Brand name"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    SKU / Model Number
                  </label>
                  <input
                    type="text"
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    placeholder="SKU-102"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              {/* Image URL with quick presets */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Product Image URL or Quick Preset <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="https://... or choose from below presets"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-500 self-center">Presets:</span>
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => setProdImage(preset.url)}
                      className={`px-2 py-0.5 rounded text-[10px] border transition-colors cursor-pointer ${
                        prodImage === preset.url
                          ? 'bg-[#f85606] text-white border-[#f85606]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bioscience checkbox */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-900 block">Science & Lab Instrument / Reagent</span>
                  <span className="text-[11px] text-blue-700">Tag as certified bioscience product with lab specifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={prodIsBioscience}
                  onChange={(e) => setProdIsBioscience(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Write clear product details, sizing, material, origin, and package contents..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#f85606] hover:bg-[#e04d05] text-white font-bold rounded-lg text-xs shadow-xs cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

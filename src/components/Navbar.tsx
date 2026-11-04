import React, { useState } from 'react';
import { ShoppingCart, Search, Store, Beaker, Truck, PhoneCall, ShieldCheck, HelpCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Navbar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    cartTotalCount,
    cartSubtotal,
    setIsCartOpen,
    activeTab,
    setActiveTab,
    shopName,
    setShopName,
    shopTagline,
    setShopTagline
  } = useShop();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [tempShopName, setTempShopName] = useState(shopName);
  const [tempTagline, setTempTagline] = useState(shopTagline);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    if (activeTab !== 'shop') {
      setActiveTab('shop');
    }
  };

  const handleSaveShopName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempShopName.trim()) {
      setShopName(tempShopName.trim());
      setShopTagline(tempTagline.trim() || 'Daraz.pk Verified Seller & Online Store');
      setIsRenameModalOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Utility Strip */}
      <div className="bg-[#f85606] text-white text-xs py-1.5 px-4 hidden sm:block border-b border-orange-600/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-medium">Pakistan's #1 Online Shopping Destination</span>
            <span className="text-orange-200">|</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Genuine Products & Cash on Delivery
            </span>
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => setActiveTab('seller')}
              className="flex items-center gap-1 hover:text-orange-100 transition-colors cursor-pointer font-medium underline underline-offset-2"
            >
              <Store className="w-3.5 h-3.5" /> Sell on Daraz (Dukandar Portal)
            </button>
            <span className="text-orange-200">|</span>
            <button
              onClick={() => setActiveTab('track')}
              className="flex items-center gap-1 hover:text-orange-100 transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5" /> Track My Order
            </button>
            <span className="text-orange-200">|</span>
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5" /> Helpline: 021-111-132729
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Brand Logo & Shop Name */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveTab('shop');
                setSearchQuery('');
                setLocalSearch('');
              }}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-[#f85606] flex items-center justify-center text-white font-extrabold text-xl shadow-xs group-hover:scale-105 transition-transform">
                d
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#f85606]">Daraz</span>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400">/</span>
                  <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight max-w-[130px] sm:max-w-[200px] truncate">
                    {shopName}
                  </span>
                </div>
                <span className="block text-[10px] text-slate-500 font-medium tracking-tight -mt-0.5 truncate max-w-[190px]">
                  {shopTagline}
                </span>
              </div>
            </button>

            {/* Quick Rename Button */}
            <button
              onClick={() => setIsRenameModalOpen(true)}
              className="text-[10px] text-slate-400 hover:text-[#f85606] hover:bg-orange-50 px-1.5 py-1 rounded transition-colors hidden sm:inline-flex items-center gap-1 cursor-pointer"
              title="Dukan ka Naya Naam Rekhein (Change Shop Name)"
            >
              Rename
            </button>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl relative flex items-center"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Daraz pe Search Karen (e.g. Leather Bag, Earbuds, Microscope, Kurti)..."
                className="w-full pl-4 pr-12 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#f85606] focus:bg-white transition-all shadow-inner"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch('');
                    setSearchQuery('');
                  }}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-2"
                >
                  ✕
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#f85606] hover:bg-[#e04d05] text-white p-2 rounded-md transition-colors cursor-pointer"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Nav Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Science / Lab Explorer Tab Button */}
            <button
              onClick={() => setActiveTab('bioscience')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'bioscience'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
              }`}
              title="NCBI PubChem & Bioscience Lab Hub"
            >
              <Beaker className="w-4 h-4 text-blue-500" />
              <span className="hidden lg:inline">Bioscience & Labs</span>
              <span className="lg:hidden">Labs</span>
            </button>

            {/* Seller / Dukandar Mode Button ("product mein Dal sakun or sell bhi kar sko") */}
            <button
              onClick={() => setActiveTab(activeTab === 'seller' ? 'shop' : 'seller')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'seller'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Store className="w-4 h-4 text-[#f85606]" />
              <span className="hidden sm:inline">
                {activeTab === 'seller' ? 'Customer Store' : 'Seller Center (Dukan)'}
              </span>
              <span className="sm:hidden">Seller</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-lg bg-orange-50 text-[#f85606] hover:bg-orange-100 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              title="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartTotalCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-[#f85606] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in">
                    {cartTotalCount}
                  </span>
                )}
              </div>
              <div className="hidden xl:block text-left text-xs leading-tight">
                <span className="text-slate-500 block text-[10px]">Total</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  Rs. {cartSubtotal.toLocaleString()}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Rename Shop Modal ("New shop name rekhna") */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-[#f85606]" />
                <h3 className="font-bold text-base text-slate-900">
                  Dukan ka Naya Naam (New Shop Name)
                </h3>
              </div>
              <button
                onClick={() => setIsRenameModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveShopName} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Shop Name (Dukan ka Naam) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={tempShopName}
                  onChange={(e) => setTempShopName(e.target.value)}
                  placeholder="e.g. Mahaza Mall, Arif Super Store, Al-Madina Store"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-hidden focus:border-[#f85606]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={tempTagline}
                  onChange={(e) => setTempTagline(e.target.value)}
                  placeholder="e.g. Daraz.pk Verified Seller & Online Store"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-hidden focus:border-[#f85606]"
                />
              </div>

              {/* Quick Suggestions */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                  Mashhur Suggestions (Quick Presets):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Mahaza Mall', 'Arif Super Store', 'Al-Rehman Mega Store', 'Pakistan Express Mart', 'BioScience Lab Store'].map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setTempShopName(name)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-orange-50 hover:text-[#f85606] text-slate-700 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRenameModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#f85606] hover:bg-[#e04d05] text-white font-bold rounded-lg text-xs shadow-xs cursor-pointer"
                >
                  Save New Shop Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

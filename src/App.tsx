import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { SellerDashboard } from './components/SellerDashboard';
import { BioscienceExplorer } from './components/BioscienceExplorer';
import { TrackOrderModal } from './components/TrackOrderModal';
import { Footer } from './components/Footer';
import { Filter, ArrowUpDown, Sparkles, Store, ShoppingBag } from 'lucide-react';

const MainShopContent: React.FC = () => {
  const {
    products,
    selectedCategory,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    shopName
  } = useShop();

  const [sortBy, setSortBy] = useState<'featured' | 'low-high' | 'high-low' | 'rating'>('featured');

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      p.category === selectedCategory ||
      (selectedCategory.includes('Bioscience') && p.isBioscience);

    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'low-high') return a.price - b.price;
    if (sortBy === 'high-low') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // default featured
  });

  return (
    <div>
      {/* Hero Banner (Only shown on shop default view when not actively searching) */}
      {!searchQuery && selectedCategory === 'All' && <HeroBanner />}

      {/* Main Catalog Section */}
      <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* Section Header with Category & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>{selectedCategory === 'All' ? `${shopName} Featured Catalog` : selectedCategory}</span>
              <span className="text-xs font-semibold text-slate-400">
                ({sortedProducts.length} items)
              </span>
            </h2>
            {searchQuery && (
              <p className="text-xs text-slate-500 mt-0.5">
                Showing results for "<span className="font-semibold text-slate-800">{searchQuery}</span>"
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#f85606] font-semibold ml-2 hover:underline cursor-pointer"
                >
                  Clear Search
                </button>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-[#f85606] cursor-pointer"
              >
                <option value="featured">Featured / Best Match</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
            <ShoppingBag className="w-14 h-14 stroke-1 mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">
              Koi Product Nahi Mila (No Products Found)
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Aap apni search badal kar dekhein ya Seller Center mein jakar naya product shamil karein.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setActiveTab('seller')}
                className="px-4 py-2 bg-[#f85606] hover:bg-[#e04d05] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5" /> Go to Seller Center
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { activeTab } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      {/* Navigation Header */}
      <Navbar />

      {/* Category Strip (Visible on Storefront view) */}
      {activeTab === 'shop' && <CategoryBar />}

      {/* Dynamic View Body */}
      <main className="flex-1">
        {activeTab === 'shop' && <MainShopContent />}
        {activeTab === 'seller' && <SellerDashboard />}
        {activeTab === 'bioscience' && <BioscienceExplorer />}
        {activeTab === 'track' && <TrackOrderModal />}
      </main>

      {/* Overlays and Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}

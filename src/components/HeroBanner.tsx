import React from 'react';
import { Truck, Banknote, ShieldCheck, MessageCircle, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const HeroBanner: React.FC = () => {
  const { setSelectedCategory, setActiveTab } = useShop();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2">
      {/* Visual Campaign Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-xs bg-slate-900 border border-slate-200 aspect-21/9 sm:aspect-24/9 min-h-[180px] max-h-[340px]">
        <img
          src="/src/assets/images/daraz_hero_banner_1793795962999.jpg"
          alt="Daraz Pakistan 11.11 Shopping Festival"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        {/* Soft overlay gradient on left for contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center">
          <div className="p-6 sm:p-10 max-w-lg text-white">
            <span className="inline-block text-[11px] font-bold tracking-widest uppercase bg-[#f85606] px-2.5 py-0.5 rounded-sm mb-2 text-white">
              Biggest Sale of the Year
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white mb-2">
              Daraz Mega Shopping Festival
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mb-4 line-clamp-2">
              Flat discounts on Electronics, Fashion, Shoes, Bags, and Bioscience Lab Instruments with Cash on Delivery nationwide.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  const target = document.getElementById('products-section');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#f85606] hover:bg-[#e04d05] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('seller')}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap"
              >
                Sell on Daraz
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Column Trust Strip below hero banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-[#f85606] flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Free Delivery</h4>
            <p className="text-[11px] text-slate-500">Across Pakistan on Rs. 2,500+</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Cash on Delivery</h4>
            <p className="text-[11px] text-slate-500">Pay when delivered at doorstep</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">WhatsApp Updates</h4>
            <p className="text-[11px] text-slate-500">Direct 2-number order tracking</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">100% Genuine</h4>
            <p className="text-[11px] text-slate-500">7 Days hassle-free returns</p>
          </div>
        </div>
      </div>
    </div>
  );
};

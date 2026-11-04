import React from 'react';
import { Store, ShieldCheck, Truck, Phone, MessageCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { setActiveTab, setSelectedCategory, shopName, shopTagline } = useShop();

  return (
    <footer className="bg-white border-t border-slate-200 mt-12 no-print">
      {/* Top Value Strip */}
      <div className="bg-slate-50 border-b border-slate-200 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 text-[#f85606] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Nationwide Delivery</span>
              <span>Fast courier delivery across all 4 provinces of Pakistan</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Safe Cash on Delivery</span>
              <span>Inspect your parcel at doorstep before payment</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">WhatsApp Order Updates</span>
              <span>Real-time dispatch alerts directly to your WhatsApp</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Seller & Dukandar Portal</span>
              <span>Add products, sell online, and manage orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          {/* Brand & Contact */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#f85606] flex items-center justify-center text-white font-extrabold text-lg">
                d
              </div>
              <span className="text-lg font-black text-[#f85606]">{shopName}</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              {shopTagline}. Pakistan's premier multi-vendor e-commerce platform offering thousands of products with verified landmark delivery.
            </p>
            <div className="text-slate-700 font-semibold space-y-1">
              <div>UAN Helpline: 021-111-132729</div>
              <div>Support WhatsApp: +92 300 1234567</div>
            </div>
          </div>

          {/* Customer Care */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Customer Care
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <button onClick={() => setActiveTab('track')} className="hover:text-[#f85606] cursor-pointer">
                  Track My Order
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('shop')} className="hover:text-[#f85606] cursor-pointer">
                  Cash on Delivery Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('shop')} className="hover:text-[#f85606] cursor-pointer">
                  Returns & Refunds (7 Days)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('shop')} className="hover:text-[#f85606] cursor-pointer">
                  Daraz Mall Verified Quality
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Categories */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('Electronics');
                    setActiveTab('shop');
                  }}
                  className="hover:text-[#f85606] cursor-pointer"
                >
                  Mobiles & Electronics
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('Shoes & Bags');
                    setActiveTab('shop');
                  }}
                  className="hover:text-[#f85606] cursor-pointer"
                >
                  Leather Bags & Shoes
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('Women\'s Fashion');
                    setActiveTab('shop');
                  }}
                  className="hover:text-[#f85606] cursor-pointer"
                >
                  Pakistani Designer Kurtis
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('bioscience')}
                  className="text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  NCBI Bioscience & Lab Supplies
                </button>
              </li>
            </ul>
          </div>

          {/* Payment & Logistics Partners */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Payment & Logistics
            </h4>
            <p className="text-slate-500 text-[11px]">
              We accept all Pakistani digital payments and cash on delivery:
            </p>
            <div className="flex flex-wrap gap-1.5 font-bold text-[10px]">
              <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded">EasyPaisa</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded">JazzCash</span>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">Cash on Delivery</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Meezan Bank</span>
              <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded">Visa / MC</span>
            </div>

            <div className="pt-2">
              <span className="text-[10px] text-slate-400 block mb-1">Courier Partners:</span>
              <div className="flex flex-wrap gap-2 text-[10px] text-slate-600 font-mono">
                <span>TCS</span> · <span>Leopards</span> · <span>Daraz Express</span> · <span>M&P</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 mt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs gap-3">
          <div>
            © {new Date().getFullYear()} {shopName} (Daraz.pk Online Store). All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('seller')}
              className="text-[#f85606] font-semibold hover:underline cursor-pointer"
            >
              Seller Center (Dukan Panel)
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('track')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Track Orders
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { Search, Truck, CheckCircle2, Clock, Phone, MessageSquare, MapPin, Package, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';

export const TrackOrderModal: React.FC = () => {
  const { orders, setActiveTab } = useShop();
  const [searchInput, setSearchInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(orders[0] || null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchInput.trim().toLowerCase();
    if (!clean) return;

    const found = orders.find(
      o => o.id.toLowerCase() === clean ||
           o.customer.callPhone.includes(clean) ||
           o.customer.whatsappNumber.includes(clean)
    );

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs text-center space-y-4">
        <div className="w-12 h-12 bg-orange-50 text-[#f85606] rounded-xl flex items-center justify-center mx-auto">
          <Truck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Track Your Daraz Order (Apna Order Track Karein)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
            Enter your Order ID (e.g. DZ-PK-89102) or your registered 11-digit Call / WhatsApp number.
          </p>
        </div>

        <form onSubmit={handleTrackSubmit} className="max-w-md mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Order ID (DZ-PK-...) ya Phone Number..."
              className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#f85606] font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#f85606] hover:bg-[#e04d05] text-white text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer shrink-0"
          >
            Track Order
          </button>
        </form>
      </div>

      {/* Tracking Result */}
      {searchedOrder ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6 animate-in fade-in">
          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                  {searchedOrder.id}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  searchedOrder.status === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : searchedOrder.status === 'Dispatched' || searchedOrder.status === 'Out for Delivery'
                    ? 'bg-blue-100 text-blue-800'
                    : searchedOrder.status === 'Confirmed'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {searchedOrder.status}
                </span>
              </div>
              <span className="text-xs text-slate-400 block mt-1">
                Placed on: {new Date(searchedOrder.createdAt).toLocaleString('en-PK', { dateStyle: 'long', timeStyle: 'short' })}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Total Payable:</span>
              <span className="text-xl font-black text-[#f85606] tabular-nums">
                Rs. {searchedOrder.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Timeline visualization */}
          <div className="py-2">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-4">
              Real-Time Courier Tracking Steps
            </h3>
            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {searchedOrder.trackingSteps.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-3">
                  <div className={`absolute -left-6 top-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 ${
                    step.completed
                      ? 'bg-emerald-600 border-white text-white shadow-xs'
                      : 'bg-white border-slate-300 text-slate-300'
                  }`}>
                    {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3 h-3" />}
                  </div>
                  <div>
                    <span className={`text-xs font-bold block ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.date}
                    </span>
                    <p className={`text-xs mt-0.5 ${step.completed ? 'text-slate-600' : 'text-slate-400'}`}>
                      {step.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Customer & Contacts:</span>
              <div className="font-bold text-slate-800 text-sm">{searchedOrder.customer.fullName}</div>
              <div className="text-slate-600 mt-1 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                Call Phone: <b className="font-mono text-slate-900">{searchedOrder.customer.callPhone}</b>
              </div>
              <div className="text-slate-600 mt-1 flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                WhatsApp: <b className="font-mono text-emerald-700">{searchedOrder.customer.whatsappNumber}</b>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Delivery Destination:</span>
              <div className="font-semibold text-slate-800">{searchedOrder.customer.address}</div>
              <div className="text-slate-600">{searchedOrder.customer.area}, {searchedOrder.customer.city}</div>
              <div className="p-2 bg-amber-50 rounded-md border border-amber-200 mt-2 text-amber-950 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-700 inline mr-1" />
                Landmark: <b>{searchedOrder.customer.famousLandmark}</b>
              </div>
            </div>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
          <p className="font-bold text-slate-800 text-sm">Koi Order Nahi Mila (No Order Found)</p>
          <p className="text-xs text-slate-500 mt-1">Please verify your Order ID or phone number and try again.</p>
        </div>
      ) : null}
    </div>
  );
};

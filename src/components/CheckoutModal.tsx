import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  MessageSquare, 
  CreditCard, 
  Banknote, 
  Wallet, 
  Building, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CustomerInfo, PaymentMethod } from '../types';
import { PAKISTAN_PROVINCES, POPULAR_CITIES } from '../data/pakistanLocations';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    deliveryFee,
    discountAmount,
    placeOrder
  } = useShop();

  // Form fields
  const [fullName, setFullName] = useState('');
  const [callPhone, setCallPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [sameAsCallNumber, setSameAsCallNumber] = useState(true);
  const [province, setProvince] = useState('Punjab');
  const [city, setCity] = useState('Lahore');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [famousLandmark, setFamousLandmark] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [paymentRef, setPaymentRef] = useState('');

  // Error validation
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const total = Math.max(0, cartSubtotal + deliveryFee - discountAmount);

  // Available cities based on selected province
  const currentProvinceData = PAKISTAN_PROVINCES.find(p => p.province === province);
  const availableCities = currentProvinceData ? currentProvinceData.cities : POPULAR_CITIES;

  const handleCallPhoneChange = (val: string) => {
    // Only allow numbers and basic dashes
    const clean = val.replace(/[^0-9]/g, '').slice(0, 11);
    setCallPhone(clean);
    if (sameAsCallNumber) {
      setWhatsappNumber(clean);
    }
  };

  const handleWhatsAppChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '').slice(0, 11);
    setWhatsappNumber(clean);
  };

  const handleSameNumberToggle = (checked: boolean) => {
    setSameAsCallNumber(checked);
    if (checked) {
      setWhatsappNumber(callPhone);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Form Validations
    if (!fullName.trim()) {
      setErrorMsg('Meherbani farma kar apna Pura Naam (Full Name) darj karein.');
      return;
    }
    if (callPhone.length < 10) {
      setErrorMsg('Call Number sahi darj karein (e.g. 03001234567, 11 digits).');
      return;
    }
    const finalWhatsApp = sameAsCallNumber ? callPhone : whatsappNumber;
    if (finalWhatsApp.length < 10) {
      setErrorMsg('WhatsApp Number sahi darj karein taake order confirmation aur tracking message bheja ja sake.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Mukammal Ghar ka Pata (House & Street Address) likhein.');
      return;
    }
    if (!famousLandmark.trim()) {
      setErrorMsg('Mashhur Jagah / Landmark ka Naam likhein (e.g. Jamia Masjid ke samne, Shell pump ke paas). Courier rider ke liye lazmi hai!');
      return;
    }

    if ((paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash' || paymentMethod === 'bank_transfer') && !paymentRef.trim()) {
      setErrorMsg('Please enter your Transaction ID (TID) / Payment Reference number.');
      return;
    }

    setIsSubmitting(true);

    const customer: CustomerInfo = {
      fullName: fullName.trim(),
      callPhone: callPhone.trim(),
      whatsappNumber: finalWhatsApp.trim(),
      province,
      city,
      area: area.trim() || city,
      address: address.trim(),
      famousLandmark: famousLandmark.trim(),
      deliveryInstructions: deliveryInstructions.trim()
    };

    setTimeout(() => {
      placeOrder(customer, paymentMethod, paymentRef);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] flex flex-col">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-[#f85606] to-[#e04d05] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">
                Order Checkout & Delivery Information
              </h2>
              <p className="text-xs text-orange-100">
                Cash on Delivery, Call & WhatsApp Verification across Pakistan
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-4 sm:p-6 md:p-8 flex-1 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-medium animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Customer Contact (2 Phone Numbers) */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Phone className="w-4 h-4 text-[#f85606]" />
              <h3 className="text-sm font-bold text-slate-900">
                1. Customer & 2 Contact Numbers (Call & WhatsApp)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Full Name (Pura Naam) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Muhammad Usman / Ayesha Khan"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:border-[#f85606] shadow-2xs"
                />
              </div>

              {/* Call Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Call Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    🇵🇰 +92
                  </span>
                  <input
                    type="tel"
                    required
                    value={callPhone}
                    onChange={(e) => handleCallPhoneChange(e.target.value)}
                    placeholder="03001234567"
                    className="w-full pl-16 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:outline-hidden focus:border-[#f85606] shadow-2xs"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Rider is number par call karega
                </span>
              </div>

              {/* WhatsApp Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-[#f85606] font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsCallNumber}
                      onChange={(e) => handleSameNumberToggle(e.target.checked)}
                      className="rounded text-[#f85606] focus:ring-[#f85606] w-3.5 h-3.5"
                    />
                    Same as Call
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    💬 +92
                  </span>
                  <input
                    type="tel"
                    required
                    disabled={sameAsCallNumber}
                    value={sameAsCallNumber ? callPhone : whatsappNumber}
                    onChange={(e) => handleWhatsAppChange(e.target.value)}
                    placeholder="03001234567"
                    className="w-full pl-16 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:outline-hidden focus:border-[#f85606] shadow-2xs disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Order status aur receipt WhatsApp par aayegi
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Comprehensive Address & Famous Landmark */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <MapPin className="w-4 h-4 text-[#f85606]" />
              <h3 className="text-sm font-bold text-slate-900">
                2. Shipping Address & Famous Landmark (Mashhur Jagah)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Province */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Province / Region <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={province}
                    onChange={(e) => {
                      const newProv = e.target.value;
                      setProvince(newProv);
                      const provObj = PAKISTAN_PROVINCES.find(p => p.province === newProv);
                      if (provObj && provObj.cities.length > 0) {
                        setCity(provObj.cities[0]);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 appearance-none focus:outline-hidden focus:border-[#f85606] shadow-2xs"
                  >
                    {PAKISTAN_PROVINCES.map(p => (
                      <option key={p.province} value={p.province}>{p.province}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City (Shehar) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 appearance-none focus:outline-hidden focus:border-[#f85606] shadow-2xs"
                  >
                    {availableCities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Area / Sector / Mohalla */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Area / Sector / Town / Mohalla <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Gulberg III, DHA Phase 5, Satellite Town, F-10/2, Nazimabad No. 4"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:border-[#f85606] shadow-2xs"
                />
              </div>

              {/* Full House & Street Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Complete House & Street Address (Ghar ka Pata) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Flat #, Street #, Building Name, Road"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:border-[#f85606] shadow-2xs"
                />
              </div>

              {/* Famous Landmark (Mashhur Jagah) - HIGHLIGHTED AS REQUIRED */}
              <div className="sm:col-span-2 bg-amber-50/80 p-3.5 rounded-lg border border-amber-300">
                <label className="block text-xs font-bold text-amber-950 mb-1 flex items-center justify-between">
                  <span>Famous Nearby Landmark (Mashhur Jagah ka Naam) <span className="text-red-500">*</span></span>
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">Rider ke liye ahem</span>
                </label>
                <input
                  type="text"
                  required
                  value={famousLandmark}
                  onChange={(e) => setFamousLandmark(e.target.value)}
                  placeholder="e.g. Near Jamia Masjid Bilal, Opposite Shell Petrol Pump, Beside City Hospital, Near Main Gate"
                  className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:border-[#f85606] shadow-2xs placeholder-slate-400"
                />
                <p className="text-[11px] text-amber-900/80 mt-1">
                  Apne ghar ke qareeb kisi mashhur masjid, school, pump ya hospital ka naam likhein taake parcel foran pohanch sake.
                </p>
              </div>

              {/* Delivery Instructions */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Notes / Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="e.g. Call before coming, Deliver after 2 PM, Gatekeeper ko de dein"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-[#f85606]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method Options */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <CreditCard className="w-4 h-4 text-[#f85606]" />
              <h3 className="text-sm font-bold text-slate-900">
                3. Payment Method (Tareeqa-e-Adaigi)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Cash on Delivery */}
              <label
                className={`relative p-3.5 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#f85606] bg-orange-50/50 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-[#f85606] focus:ring-[#f85606]"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Ghar par parcel deliver hone par cash dain
                  </p>
                </div>
                <span className="mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded w-fit">
                  Sab se Zyada Pasandida
                </span>
              </label>

              {/* Option 2: EasyPaisa */}
              <label
                className={`relative p-3.5 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'easypaisa'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                    EP
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'easypaisa'}
                    onChange={() => setPaymentMethod('easypaisa')}
                    className="text-emerald-600 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">EasyPaisa Wallet</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Instant Mobile Account Transfer
                  </p>
                </div>
                <span className="mt-2 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded w-fit">
                  0300-9876543
                </span>
              </label>

              {/* Option 3: JazzCash */}
              <label
                className={`relative p-3.5 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'jazzcash'
                    ? 'border-red-600 bg-red-50/50 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                    JC
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'jazzcash'}
                    onChange={() => setPaymentMethod('jazzcash')}
                    className="text-red-600 focus:ring-red-600"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">JazzCash Wallet</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Fast Mobilink Microfinance Transfer
                  </p>
                </div>
                <span className="mt-2 text-[10px] font-bold text-red-800 bg-red-100 px-1.5 py-0.5 rounded w-fit">
                  0301-8765432
                </span>
              </label>

              {/* Option 4: Bank Transfer */}
              <label
                className={`relative p-3.5 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-2">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="text-blue-600 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Bank Transfer</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Meezan / HBL / Alfalah Online
                  </p>
                </div>
                <span className="mt-2 text-[10px] font-bold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded w-fit">
                  Online Banking
                </span>
              </label>

              {/* Option 5: Card */}
              <label
                className={`relative p-3.5 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-purple-600 bg-purple-50/50 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center mb-2">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="text-purple-600 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Debit / Credit Card</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Visa, MasterCard, PayPak
                  </p>
                </div>
                <span className="mt-2 text-[10px] font-bold text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded w-fit">
                  Secure Checkout
                </span>
              </label>
            </div>

            {/* Sub-details for EasyPaisa / JazzCash / Bank Transfer */}
            {(paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash' || paymentMethod === 'bank_transfer') && (
              <div className="p-3.5 bg-white rounded-lg border border-slate-200 space-y-2 text-xs animate-in fade-in">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-800 block">Merchant Account Details:</span>
                  {paymentMethod === 'easypaisa' && (
                    <div className="text-slate-600 space-y-0.5 mt-1 font-mono text-xs">
                      <div>Account: <b className="text-slate-900">0300-9876543</b></div>
                      <div>Title: <b className="text-slate-900">Daraz PK Official Store</b></div>
                    </div>
                  )}
                  {paymentMethod === 'jazzcash' && (
                    <div className="text-slate-600 space-y-0.5 mt-1 font-mono text-xs">
                      <div>Account: <b className="text-slate-900">0301-8765432</b></div>
                      <div>Title: <b className="text-slate-900">Daraz PK Store Merchant</b></div>
                    </div>
                  )}
                  {paymentMethod === 'bank_transfer' && (
                    <div className="text-slate-600 space-y-0.5 mt-1 font-mono text-xs">
                      <div>Bank: <b className="text-slate-900">Meezan Bank Limited</b></div>
                      <div>IBAN: <b className="text-slate-900">PK36MEZN0001234567890123</b></div>
                      <div>Title: <b className="text-slate-900">Daraz PK E-Commerce Ltd</b></div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enter Transaction ID (TID) / Sender Number: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder="e.g. TID-98234123 ya JazzCash Sender Name"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Items & Total Summary */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
              Order Summary ({cart.length} unique items)
            </h4>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 max-w-[70%]">
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {item.quantity}x
                    </span>
                    <span className="text-slate-700 truncate">{item.product.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums">
                    Rs. {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="tabular-nums">Rs. {cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery (Pakistan Nationwide)</span>
                <span className="tabular-nums">
                  {deliveryFee === 0 ? <b className="text-emerald-600">FREE</b> : `Rs. ${deliveryFee}`}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="tabular-nums">-Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Payable:</span>
                <span className="text-[#f85606] tabular-nums">Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Place Order CTA Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full py-3.5 px-4 bg-[#f85606] hover:bg-[#e04d05] text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>Processing Order...</>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Place Order Now - Rs. {total.toLocaleString()} ({paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod.toUpperCase()})
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              Order place hone ke baad aapko WhatsApp aur Call par verification message mil jayega.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

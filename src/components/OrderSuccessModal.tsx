import React from 'react';
import { CheckCircle2, MessageSquare, Printer, ArrowRight, MapPin, Phone, Truck, Copy, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const OrderSuccessModal: React.FC = () => {
  const { completedOrder, setCompletedOrder, setActiveTab } = useShop();
  const [copied, setCopied] = React.useState(false);

  if (!completedOrder) return null;

  const order = completedOrder;

  // Clean WhatsApp number for Pakistan international format
  const rawNum = order.customer.whatsappNumber.replace(/[^0-9]/g, '');
  const waNumber = rawNum.startsWith('0') ? `92${rawNum.slice(1)}` : rawNum;

  // Pre-filled WhatsApp message
  const waMessage = encodeURIComponent(
    `Assalam-o-Alaikum! My Daraz PK Order #${order.id} has been placed.\n` +
    `Name: ${order.customer.fullName}\n` +
    `Call Phone: ${order.customer.callPhone}\n` +
    `WhatsApp: ${order.customer.whatsappNumber}\n` +
    `Delivery City: ${order.customer.city}, ${order.customer.province}\n` +
    `Address: ${order.customer.address}\n` +
    `Famous Landmark: ${order.customer.famousLandmark}\n` +
    `Payment Method: ${order.paymentMethod.toUpperCase()}\n` +
    `Total Amount: Rs. ${order.total.toLocaleString()}\n` +
    `Please confirm my shipment!`
  );

  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] flex flex-col">
        {/* Success Banner */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-center relative">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Order Successfully Placed!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Shukriya! Aapka order Daraz system mein record ho chuka hai.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-black/20 backdrop-blur-xs px-3.5 py-1.5 rounded-lg border border-white/20 text-xs">
            <span className="text-emerald-200">Order ID:</span>
            <span className="font-mono font-bold text-white tracking-wider">{order.id}</span>
            <button
              onClick={handleCopyOrderId}
              className="text-white hover:text-emerald-200 p-0.5 ml-1 transition-colors cursor-pointer"
              title="Copy Order ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-1">
          {/* Quick Actions (WhatsApp & Print) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 no-print">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
              Send Order Slip on WhatsApp
            </a>

            <button
              onClick={handlePrint}
              className="p-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Receipt / Invoice
            </button>
          </div>

          {/* Customer & Delivery Verification Box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200">
              Customer & Delivery Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-slate-500 block">Customer Name:</span>
                <span className="font-semibold text-slate-900">{order.customer.fullName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Payment Method:</span>
                <span className="font-semibold text-[#f85606] uppercase">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery (Ghar Par Cash)' : order.paymentMethod.toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Call Number:</span>
                <span className="font-mono font-semibold text-slate-900">{order.customer.callPhone}</span>
              </div>
              <div>
                <span className="text-slate-500 block">WhatsApp Number:</span>
                <span className="font-mono font-semibold text-emerald-700">{order.customer.whatsappNumber}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block">Delivery Address:</span>
                <span className="font-medium text-slate-800">
                  {order.customer.address}, {order.customer.area}, {order.customer.city}, {order.customer.province}
                </span>
              </div>
              <div className="sm:col-span-2 p-2.5 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-amber-900 font-bold block text-[11px]">
                  Famous Nearby Landmark (Mashhur Jagah):
                </span>
                <span className="font-semibold text-amber-950">{order.customer.famousLandmark}</span>
              </div>
            </div>
          </div>

          {/* Itemized Receipt */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 p-2.5 font-bold text-slate-800 flex justify-between">
              <span>Ordered Items</span>
              <span>Amount (PKR)</span>
            </div>
            <div className="divide-y divide-slate-100 p-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-slate-800">{item.product.name}</span>
                    <span className="text-slate-400 block text-[11px]">Qty: {item.quantity} x Rs. {item.product.price.toLocaleString()}</span>
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums">
                    Rs. {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="tabular-nums">Rs. {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : `Rs. ${order.deliveryFee}`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-Rs. {order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-1 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-[#f85606] tabular-nums">Rs. {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Tracking Step Preview */}
          <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-center gap-3">
            <Truck className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <span className="font-bold block">Live Order Tracking Activated</span>
              <p className="text-[11px] text-blue-800">
                You can track your parcel anytime in "Track My Order" using Order ID <b>{order.id}</b> or your Call number.
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 no-print">
          <button
            onClick={() => {
              setCompletedOrder(null);
              setActiveTab('shop');
            }}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#f85606] hover:bg-[#e04d05] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

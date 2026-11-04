import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    discountAmount,
    voucherCode,
    applyVoucher,
    setIsCheckoutOpen
  } = useShop();

  const [inputVoucher, setInputVoucher] = useState('');
  const [voucherMsg, setVoucherMsg] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isCartOpen) return null;

  const total = Math.max(0, cartSubtotal + deliveryFee - discountAmount);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVoucher.trim()) return;
    const res = applyVoucher(inputVoucher);
    setVoucherMsg({ text: res.message, error: !res.success });
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-2xs transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#f85606]" />
              <h2 className="text-base font-bold text-slate-900">
                Your Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery progress bar */}
          <div className="p-3 bg-orange-50 border-b border-orange-100 text-xs">
            {cartSubtotal >= 2500 ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <Truck className="w-4 h-4" /> Congratulations! You unlocked FREE Delivery across Pakistan!
              </span>
            ) : (
              <div className="space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Add <b>Rs. {(2500 - cartSubtotal).toLocaleString()}</b> more for Free Delivery</span>
                  <span className="font-bold">{Math.round((cartSubtotal / 2500) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#f85606] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (cartSubtotal / 2500) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <ShoppingBag className="w-16 h-16 stroke-1 text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-700 mb-1">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mb-4">
                  Explore our top-selling electronics, fashion, and bioscience products to add them to your cart.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 bg-[#f85606] text-white text-xs font-semibold rounded-lg hover:bg-[#e04d05] transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-18 h-18 rounded-lg object-cover bg-white shrink-0 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-red-500 p-0.5 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-[11px] text-slate-500">{item.product.category}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-[#f85606] tabular-nums">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Quantity stepper */}
                      <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-100"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-semibold tabular-nums text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="px-2 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Calculations and Voucher */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              {/* Voucher input */}
              <form onSubmit={handleApplyVoucher} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={inputVoucher}
                    onChange={(e) => setInputVoucher(e.target.value)}
                    placeholder="Voucher code (DARAZ11)"
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {voucherMsg && (
                <p className={`text-[11px] font-medium ${voucherMsg.error ? 'text-red-600' : 'text-emerald-600'}`}>
                  {voucherMsg.text}
                </p>
              )}

              {/* Subtotal breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    Rs. {cartSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee (Pakistan Nationwide)</span>
                  <span className="font-semibold tabular-nums">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      `Rs. ${deliveryFee}`
                    )}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount Voucher ({voucherCode})</span>
                    <span className="font-semibold tabular-nums">-Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span className="text-[#f85606] tabular-nums">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={handleProceedCheckout}
                className="w-full py-3 bg-[#f85606] hover:bg-[#e04d05] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

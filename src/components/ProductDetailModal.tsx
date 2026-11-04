import React, { useState } from 'react';
import { X, Star, Truck, ShieldCheck, ShoppingCart, Zap, Check, MapPin, Store } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForDetail,
    setSelectedProductForDetail,
    addToCart,
    setIsCheckoutOpen
  } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!selectedProductForDetail) return null;

  const product = selectedProductForDetail;
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleDirectBuy = () => {
    addToCart(product, quantity);
    setSelectedProductForDetail(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header Close Button */}
        <button
          onClick={() => setSelectedProductForDetail(null)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Gallery Column */}
            <div>
              <div className="rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square flex items-center justify-center relative">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {product.isDarazMall && (
                  <span className="absolute top-3 left-3 bg-[#f85606] text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs uppercase">
                    DarazMall Verified
                  </span>
                )}
                {product.isBioscience && (
                  <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs uppercase">
                    Bioscience Research Grade
                  </span>
                )}
              </div>

              {/* Delivery trust badges */}
              <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#f85606]" />
                  <span>Standard Delivery: 2 - 4 Working Days across Pakistan</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Cash on Delivery Available at your doorstep</span>
                </div>
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-slate-600" />
                  <span>Sold by: <b className="text-slate-800">{product.sellerName || 'Verified Daraz Merchant'}</b></span>
                </div>
              </div>
            </div>

            {/* Contiguous Purchase Details Column */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-slate-700 uppercase tracking-wider">{product.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>SKU: {product.sku || 'DZ-PK-STD'}</span>
                  <span aria-hidden="true">·</span>
                  <span className={product.stock > 0 ? 'text-emerald-700 font-semibold' : 'text-red-600 font-semibold'}>
                    {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-3">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="font-bold text-slate-800 ml-1.5 text-sm">{product.rating}</span>
                  </div>
                  <span className="text-slate-400 text-xs">({product.reviewsCount} customer reviews)</span>
                </div>

                {/* Price block */}
                <div className="p-4 bg-orange-50/70 rounded-xl border border-orange-100 mb-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#f85606] tabular-nums">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <>
                        <span className="text-sm text-slate-400 line-through tabular-nums">
                          Rs. {product.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-white bg-red-600 px-2 py-0.5 rounded">
                          -{discountPercent}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-orange-950/70 mt-1">
                    Free shipping on orders above Rs. 2,500. Cash on delivery available.
                  </p>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider mb-1">
                    Product Description
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Specifications if present */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
                      Key Specifications
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                      {Object.entries(product.specifications).map(([key, val]) => (
                        <div key={key} className="bg-slate-50 p-2 rounded border border-slate-100 flex justify-between">
                          <span className="text-slate-500">{key}:</span>
                          <span className="font-medium text-slate-800 ml-2 text-right">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Purchase Actions */}
              <div className="pt-4 border-t border-slate-200 mt-4">
                {/* Quantity */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs font-bold text-slate-700 uppercase">Quantity:</span>
                  <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-sm font-semibold tabular-nums text-slate-900 bg-white">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">
                    Total: <b className="text-slate-800">Rs. {(product.price * quantity).toLocaleString()}</b>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      added
                        ? 'bg-emerald-600 text-white'
                        : 'bg-orange-100 text-[#f85606] hover:bg-orange-200'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" /> Add to Cart
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDirectBuy}
                    disabled={product.stock <= 0}
                    className="py-3 px-4 rounded-xl font-bold text-sm bg-[#f85606] text-white hover:bg-[#e04d05] shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4" /> Buy Now - COD
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Star, ShoppingBag, Zap, Check, Package } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProductForDetail, setIsCheckoutOpen } = useShop();
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      onClick={() => setSelectedProductForDetail(product)}
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Product Image Slot with Fallback */}
      <div className="relative aspect-4/3 sm:aspect-square bg-slate-50 overflow-hidden flex items-center justify-center">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            <Package className="w-10 h-10 mb-2 stroke-1" />
            <span className="text-xs font-medium text-slate-500 text-center line-clamp-1">
              {product.name}
            </span>
          </div>
        )}

        {/* Mall / Genuine Badge */}
        {product.isDarazMall && (
          <span className="absolute top-2 left-2 bg-[#f85606] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wide uppercase shadow-2xs">
            DarazMall
          </span>
        )}

        {/* Bioscience Tag */}
        {product.isBioscience && (
          <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wide uppercase shadow-2xs">
            Lab Certified
          </span>
        )}

        {/* Discount Badge */}
        {discountPercent && discountPercent > 0 && (
          <span className="absolute bottom-2 left-2 bg-red-600 text-white text-[11px] font-extrabold px-1.5 py-0.5 rounded-sm">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Card Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata row */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
            <span className="truncate max-w-[120px] font-medium text-slate-600 uppercase tracking-wider text-[10px]">
              {product.brand || product.category}
            </span>
            <span aria-hidden="true">·</span>
            <span className={product.stock > 0 ? 'text-emerald-700 font-medium' : 'text-red-600 font-medium'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-[#f85606] transition-colors line-clamp-2 leading-snug mb-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-base sm:text-lg font-bold text-[#f85606] tabular-nums">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through tabular-nums">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-700 ml-1 text-xs">{product.rating.toFixed(1)}</span>
            </div>
            <span>({product.reviewsCount})</span>
            {product.freeDelivery && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-600 text-[11px] font-medium">Free Delivery</span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`py-2 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-orange-50 text-[#f85606] hover:bg-orange-100 disabled:opacity-50'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Cart
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            className="py-2 px-2 text-xs font-semibold rounded-lg bg-[#f85606] text-white hover:bg-[#e04d05] flex items-center justify-center gap-1 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

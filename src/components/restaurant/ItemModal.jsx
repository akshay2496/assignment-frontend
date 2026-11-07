import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Star, Clock, ShoppingBag } from 'lucide-react';
import analytics from '../../../../sdk/src/analytics.js';
import { useCart } from '../../context/CartContext.jsx';
import { formatPrice } from '../../utils/format.js';

export default function ItemModal({ item, onClose }) {
  const { addToCart } = useCart();

  useEffect(() => {
    if (item) {
      analytics.track('menu_item_viewed', {
        itemId: item.id,
        itemName: item.name,
        category: item.category,
        price: item.price
      });
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [item]);

  if (!item || typeof document === 'undefined') return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      style={{ top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[88vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-up"
      >
        {/* Close Button (Fixed Pinned) */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full shadow-lg backdrop-blur-md transition"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Data & Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Item Image & Badge */}
          <div className="h-48 sm:h-56 overflow-hidden relative">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
            <div className="absolute bottom-3 left-4 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center space-x-2.5">
              <span className="flex items-center text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                {item.rating}
              </span>
              <span className="text-slate-400">•</span>
              <span className="flex items-center text-slate-200 font-medium">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {item.prepTime}
              </span>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 mb-2.5">
              <div>
                <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-md">
                  {item.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5 tracking-tight leading-snug">
                  {item.name}
                </h3>
              </div>
              <span className="text-xl sm:text-2xl font-black text-slate-900 whitespace-nowrap">
                {formatPrice(item.price)}
              </span>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-1.5">
              {item.description}
            </p>

            <div className="mt-4 p-3.5 rounded-xl bg-orange-50/70 border border-orange-100 text-xs text-orange-950 space-y-0.5">
              <span className="font-bold block">Chef's Quality Note:</span>
              <span>Prepared fresh to order using artisanal flour, San Marzano tomatoes, and farm-fresh ingredients.</span>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Action Footer */}
        <div className="flex-shrink-0 p-4 border-t border-slate-100 bg-slate-50/90 flex items-center space-x-3 z-10">
          <button
            onClick={(e) => {
              addToCart(item, e);
              onClose();
            }}
            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2.5 sm:py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-md shadow-orange-500/25 transition text-xs sm:text-sm active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart ({formatPrice(item.price)})</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 sm:py-3 border border-slate-200 hover:bg-slate-100 font-semibold rounded-xl text-slate-700 transition text-xs sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

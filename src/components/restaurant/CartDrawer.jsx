import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { formatPrice } from '../../utils/format.js';

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { items, updateQuantity, removeFromCart, totalAmount, clearCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const taxes = Math.round(totalAmount * 0.05);
  const finalTotal = Math.round(totalAmount + taxes);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex justify-end overflow-hidden animate-fade-in"
      style={{ top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm sm:max-w-md h-full bg-slate-50 shadow-2xl flex flex-col justify-between animate-slide-right"
      >
        
        <div className="px-4 py-3 bg-white border-b border-slate-200/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 leading-none">Your Cart</span>
              <span className="ml-2 text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-2 shadow-xs border border-slate-200">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-700 text-sm">Your cart is empty</p>
              <p className="text-xs text-slate-400 mt-0.5">Explore the menu and add items</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-2 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center space-x-2.5 hover:border-orange-200 transition"
              >
                
                <div
                  className="rounded-lg overflow-hidden flex-shrink-0 bg-slate-100"
                  style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px' }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    style={{ width: '44px', height: '44px', objectFit: 'cover' }}
                  />
                </div>

                
                <div className="flex-1 min-w-0 pr-1">
                  <h4 className="text-xs font-bold text-slate-800 truncate leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">{formatPrice(item.price)}</p>
                </div>

                {/* Compact Quantity Selector [- 1 +] */}
                <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden flex-shrink-0">
                  <button
                    onClick={(e) => updateQuantity(item.id, -1, e)}
                    className="w-5 h-5 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition text-xs font-bold active:scale-90"
                    title="Decrease"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold text-slate-800 select-none">
                    {item.quantity}
                  </span>
                  <button
                    onClick={(e) => updateQuantity(item.id, 1, e)}
                    className="w-5 h-5 flex items-center justify-center hover:bg-slate-200 text-slate-600 transition text-xs font-bold active:scale-90"
                    title="Increase"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>

                {/* Total Item Price & Remove Button */}
                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  <span className="text-xs font-bold text-slate-900 min-w-[40px] text-right">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={(e) => removeFromCart(item.id, e)}
                    className="text-slate-300 hover:text-rose-600 p-1 transition active:scale-90"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        
        {items.length > 0 && (
          <div className="p-3.5 bg-white border-t border-slate-200/90 flex-shrink-0 space-y-2.5 shadow-lg">
            
            <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-200/70 text-xs space-y-1">
              <div className="flex justify-between items-center text-slate-500 text-[11px]">
                <span>Items Subtotal ({totalItemCount})</span>
                <span className="font-semibold text-slate-700">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 text-[11px]">
                <span>Taxes & GST (5%)</span>
                <span className="font-semibold text-slate-700">{formatPrice(taxes)}</span>
              </div>
              <div className="pt-1 border-t border-slate-200/80 flex justify-between items-center font-bold text-slate-900">
                <span className="text-xs">To Pay</span>
                <span className="text-sm font-black text-orange-600">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-between shadow-md shadow-orange-500/20 transition active:scale-[0.99] text-xs"
            >
              <span className="font-bold text-white/95">{formatPrice(finalTotal)}</span>
              <span className="font-bold tracking-wide">Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            
            {/* <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-0.5">
              <button
                onClick={clearCart}
                className="text-slate-400 hover:text-rose-500 transition font-medium"
              >
                Clear Cart
              </button>
            </div> */}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

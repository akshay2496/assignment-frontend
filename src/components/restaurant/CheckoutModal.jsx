import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import analytics from '../../../../sdk/src/analytics.js';
import api from '../../services/api.js';
import { formatPrice } from '../../utils/format.js';

export default function CheckoutModal({ isOpen, onClose, onSuccess }) {
  const { items, totalAmount, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    tableNumber: 'Table 14',
    paymentMethod: 'card'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const grandTotal = Math.round(totalAmount * 1.05);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (items.length > 0) {
        analytics.track('checkout_started', {
          itemsCount: items.length,
          totalAmount: grandTotal,
          itemsSummary: items.map(i => ({ id: i.id, name: i.name, qty: i.quantity, price: i.price }))
        });
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, items.length, grandTotal]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError('Please provide your name and email address.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        customerName: formData.name,
        customerEmail: formData.email,
        items: items,
        totalAmount: grandTotal,
        visitorId: analytics.visitorId,
        sessionId: analytics.sessionId,
        websiteId: analytics.websiteId || 'restaurant-demo'
      };

      const res = await api.createOrder(payload);

      if (analytics.flush) analytics.flush();

      clearCart();
      onSuccess(res.data);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {/* 1. FIXED PINNED HEADER */}
        <div className="flex-shrink-0 px-5 py-4 sm:px-6 sm:py-4.5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
              Checkout & Order Placement
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tracked in real-time with Server Analytics
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition flex-shrink-0 ml-2"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. SCROLLABLE DATA BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Customer Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                placeholder="e.g. Jane Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address (Receipt & Notifications)
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                placeholder="jane@example.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Dine-in / Table
                </label>
                <input
                  type="text"
                  value={formData.tableNumber}
                  onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Payment Type
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm bg-white"
                >
                  <option value="card">Credit / Debit Card</option>
                  <option value="upi">UPI / Instant Pay</option>
                  <option value="cash">Pay at Counter</option>
                </select>
              </div>
            </div>

            {/* Items Order Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100 text-xs">
              <div className="font-bold text-slate-800 mb-1">Order Summary ({items.length} items):</div>
              {items.map((i) => (
                <div key={i.id} className="flex justify-between text-slate-600">
                  <span>{i.name} × {i.quantity}</span>
                  <span>{formatPrice(i.price * i.quantity)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-200 space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxes & Service (5%)</span>
                  <span>{formatPrice(totalAmount * 0.05)}</span>
                </div>
                <div className="flex justify-between font-black text-slate-900 text-sm pt-1">
                  <span>Grand Total</span>
                  <span className="text-orange-600">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* 3. FIXED PINNED FOOTER */}
        <div className="flex-shrink-0 p-4 sm:p-5 border-t border-slate-100 bg-slate-50/95 flex items-center space-x-3 z-10">
          <button
            type="submit"
            form="checkout-form"
            disabled={isSubmitting || items.length === 0}
            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-md shadow-orange-500/25 transition text-xs sm:text-sm active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Confirm & Pay {formatPrice(grandTotal)}</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 border border-slate-200 hover:bg-slate-100 font-semibold rounded-xl text-slate-700 transition text-xs sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

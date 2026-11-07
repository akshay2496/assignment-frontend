import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '../../utils/format.js';

export default function OrderConfirmationModal({ order, onClose, onGoToDashboard }) {
  useEffect(() => {
    if (order) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [order]);

  if (!order || typeof document === 'undefined') return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      style={{ top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[88vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-6 text-center animate-scale-up"
      >
        <div className="overflow-y-auto flex-1 pr-1">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-pop-in shadow-md shadow-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Order Confirmed!</h3>
          <p className="text-xs text-slate-500 mt-1">
            Thank you, <span className="font-bold text-slate-800">{order.customer_name}</span>
          </p>

          <div className="my-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Order ID:</span>
              <span className="font-mono font-bold text-slate-800">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Paid:</span>
              <span className="font-bold text-slate-900">{formatPrice(order.total_amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-700 text-xs">
                {order.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Receipt Sent To:</span>
              <span className="text-slate-700 font-medium truncate max-w-[180px]">{order.customer_email}</span>
            </div>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-3 text-emerald-900 text-xs text-center mb-4 flex items-center justify-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium">Sent to kitchen • Fresh preparation in progress</span>
          </div>
        </div>

        <div className="space-y-2 pt-3 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={onGoToDashboard}
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition shadow-md text-xs sm:text-sm"
          >
            <span>View in Analytics Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 font-semibold transition"
          >
            Back to Restaurant Menu
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

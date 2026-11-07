import React, { useState, useEffect } from 'react';
import { Utensils, BarChart3, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';
import analytics from '../../sdk/src/analytics.js';
import { useCart } from './context/CartContext.jsx';
import RestaurantView from './components/restaurant/RestaurantView.jsx';
import DashboardView from './components/dashboard/DashboardView.jsx';
import CartDrawer from './components/restaurant/CartDrawer.jsx';
import CheckoutModal from './components/restaurant/CheckoutModal.jsx';
import OrderConfirmationModal from './components/restaurant/OrderConfirmationModal.jsx';
import { formatPrice } from './utils/format.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('restaurant'); // 'restaurant' or 'dashboard'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const { totalCount, totalAmount, isCartBouncing } = useCart();

  useEffect(() => {
    analytics.init({
      apiUrl: 'http://localhost:5000/api/events',
      websiteId: 'restaurant-demo',
      batchInterval: 3000,
      maxBatchSize: 5,
      debug: true
    });
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    analytics.trackPageView({ page: tab === 'restaurant' ? '/' : '/dashboard' });
    setTimeout(() => {
      if (analytics.flush) analytics.flush();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Unique Premium Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl text-white">
        {/* Top Gradient Glow Stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-indigo-500" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <div
            className="flex items-center space-x-3 cursor-pointer group select-none"
            onClick={() => handleTabChange('restaurant')}
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform duration-300">
                <Utensils className="w-6 h-6" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-white text-xl tracking-tight leading-none group-hover:text-amber-300 transition">
                  Restuarant
                </span>
              </div>
            </div>
          </div>

          {/* Central Pill Tab Switcher */}
          <nav className="flex items-center space-x-1 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700/60 shadow-inner backdrop-blur-md">
            <button
              onClick={() => handleTabChange('restaurant')}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition duration-200 ${
                activeTab === 'restaurant'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Utensils className="w-4 h-4 text-white" />
              <span>Restaurant Demo</span>
            </button>
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-white" />
              <span>Analytics Dashboard</span>
            </button>
          </nav>

          {/* Right Action: SDK Status & Cart Pill Button */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>SDK ACTIVE</span>
            </div>

            <button
              id="header-cart-button"
              onClick={() => setIsCartOpen(true)}
              className={`relative px-3.5 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex items-center space-x-2.5 shadow-lg shadow-orange-500/25 transition transform hover:scale-105 active:scale-95 ${
                isCartBouncing ? 'animate-cart-bump ring-4 ring-orange-400' : ''
              }`}
              title="Open Cart Tray"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {totalCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <span className="block leading-none text-[10px] opacity-90 uppercase tracking-wider">Cart</span>
                <span className="block font-black text-xs leading-none mt-0.5">
                  {totalAmount > 0 ? formatPrice(totalAmount) : '0 items'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'restaurant' ? (
          <RestaurantView />
        ) : (
          <DashboardView />
        )}
      </main>

      {/* Slide-over Cart */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={(orderData) => {
          setIsCheckoutOpen(false);
          setCompletedOrder(orderData);
        }}
      />

      {/* Order Confirmation */}
      <OrderConfirmationModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        onGoToDashboard={() => {
          setCompletedOrder(null);
          handleTabChange('dashboard');
        }}
      />
    </div>
  );
}

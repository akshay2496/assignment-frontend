import React, { useState, useEffect } from 'react';
import { Star, Clock, Plus, Minus, Utensils, Flame, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import api from '../../services/api.js';
import ItemModal from './ItemModal.jsx';
import { formatPrice } from '../../utils/format.js';

const CATEGORIES = ['All', 'Pizza', 'Burgers', 'Pasta', 'Desserts', 'Drinks'];

export default function RestaurantView() {
  const { addToCart, items: cartItems, updateQuantity } = useCart();
  const [menu, setMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      try {
        setLoading(true);
        const res = await api.getMenu();
        setMenu(res.data || []);
      } catch (err) {
        console.error('Failed to load menu:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  const filteredMenu = selectedCategory === 'All'
    ? menu
    : menu.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600 text-white p-8 md:p-12 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 text-orange-50">
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Wood-Fired & Chef Curated Specialties</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Restuarant Artisanal Bistro
          </h1>
          <p className="mt-3 text-orange-100 text-sm md:text-base leading-relaxed">
            Every user action across our restaurant app — from browsing pizzas to checkout and payment confirmation — is tracked live via our Vanilla JS SDK and Server Tracking Client!
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
          <Utensils className="w-80 h-80" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition whitespace-nowrap flex items-center space-x-1.5 ${
                isActive
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{category}</span>
            </button>
          );
        })}
      </div>

      {/* Menu */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-100 p-4">
              <div className="w-full h-44 bg-slate-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-200/80 hover:border-orange-300 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div
                className="relative h-48 overflow-hidden cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center space-x-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{item.rating}</span>
                </div>
                <div className="absolute top-3 right-3 bg-slate-900/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-medium text-white flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.prepTime}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-lg font-black text-slate-900">{formatPrice(item.price)}</span>
                  </div>
                  <h3
                    onClick={() => setSelectedItem(item)}
                    className="font-bold text-slate-900 text-base group-hover:text-orange-600 transition cursor-pointer line-clamp-1"
                  >
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl border border-slate-200 transition text-center"
                  >
                    Details
                  </button>

                  {(() => {
                    const cartItem = cartItems.find((i) => i.id === item.id);
                    const qty = cartItem ? cartItem.quantity : 0;

                    if (qty > 0) {
                      return (
                        <div className="flex items-center bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 overflow-hidden">
                          <button
                            onClick={(e) => updateQuantity(item.id, -1, e)}
                            className="px-2.5 py-2 hover:bg-orange-700 transition flex items-center justify-center text-white active:scale-90"
                            title="Decrease"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold min-w-[20px] text-center select-none text-white">
                            {qty}
                          </span>
                          <button
                            onClick={(e) => updateQuantity(item.id, 1, e)}
                            className="px-2.5 py-2 hover:bg-orange-700 transition flex items-center justify-center text-white active:scale-90"
                            title="Increase"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    }

                    return (
                      <button
                        onClick={(e) => addToCart(item, e)}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-orange-600/20 transition active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Details */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

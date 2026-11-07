import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import analytics from '../../../sdk/src/analytics.js';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'restaurant_cart_items';

export function CartProvider({ children }) {
  // Load saved cart items from localStorage on initial load
  const [items, setItems] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.warn('Failed to parse cart from storage:', err);
      return [];
    }
  });

  const [flyingItems, setFlyingItems] = useState([]);
  const [isCartBouncing, setIsCartBouncing] = useState(false);

  // Automatically persist cart to localStorage whenever items change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [items]);

  const triggerFlyAnimation = (product, clickEvent, isReverse = false) => {
    if (typeof window === 'undefined') return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;

    if (clickEvent) {
      if (clickEvent.clientX && clickEvent.clientY) {
        targetX = clickEvent.clientX;
        targetY = clickEvent.clientY;
      } else if (clickEvent.currentTarget && clickEvent.currentTarget.getBoundingClientRect) {
        const rect = clickEvent.currentTarget.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
      }
    }

    const cartBtn = document.getElementById('header-cart-button');
    let cartX = window.innerWidth - 65;
    let cartY = 32;

    if (cartBtn) {
      const rect = cartBtn.getBoundingClientRect();
      cartX = rect.left + rect.width / 2;
      cartY = rect.top + rect.height / 2;
    }

    // For forward (Add +): starts at button (targetX, targetY) -> flies to cart (cartX, cartY)
    // For reverse (Minus -): starts at cart (cartX, cartY) -> flies down to button (targetX, targetY)
    const startX = isReverse ? cartX : targetX;
    const startY = isReverse ? cartY : targetY;
    const endX = isReverse ? targetX : cartX;
    const endY = isReverse ? targetY : cartY;

    const flyId = `${Date.now()}_${Math.random()}`;
    const newFly = {
      id: flyId,
      image: product.image,
      name: product.name,
      startX,
      startY,
      endX,
      endY,
      isReverse
    };

    setFlyingItems((prev) => [...prev, newFly]);

    if (isReverse) {
      setIsCartBouncing(true);
      setTimeout(() => setIsCartBouncing(false), 450);
    }

    // When the flying item lands (after 620ms)
    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((f) => f.id !== flyId));
      if (!isReverse) {
        setIsCartBouncing(true);
        setTimeout(() => setIsCartBouncing(false), 500);
      }
    }, 620);
  };

  const addToCart = (product, clickEvent) => {
    if (clickEvent) {
      triggerFlyAnimation(product, clickEvent, false);
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    analytics.track('add_to_cart', {
      itemId: product.id,
      itemName: product.name,
      category: product.category,
      price: product.price
    });
  };

  const removeFromCart = (productId, clickEvent) => {
    const itemToRemove = items.find((i) => i.id === productId);
    if (itemToRemove && clickEvent) {
      triggerFlyAnimation(itemToRemove, clickEvent, true);
    }

    setItems((prev) => prev.filter((i) => i.id !== productId));

    if (itemToRemove) {
      analytics.track('remove_from_cart', {
        itemId: itemToRemove.id,
        itemName: itemToRemove.name,
        price: itemToRemove.price
      });
    }
  };

  const updateQuantity = (productId, delta, clickEvent) => {
    const item = items.find((i) => i.id === productId);
    if (!item) return;

    if (clickEvent) {
      triggerFlyAnimation(item, clickEvent, delta < 0);
    }

    if (delta < 0 && item.quantity + delta <= 0) {
      removeFromCart(productId, clickEvent);
      return;
    }

    setItems((prev) =>
      prev
        .map((i) => {
          if (i.id === productId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean)
    );

    if (delta > 0) {
      analytics.track('add_to_cart', {
        itemId: item.id,
        itemName: item.name,
        category: item.category,
        price: item.price
      });
    } else {
      analytics.track('remove_from_cart', {
        itemId: item.id,
        itemName: item.name,
        price: item.price
      });
    }
  };

  const clearCart = () => {
    setItems([]);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
      } catch (err) {}
    }
  };

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const totalCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalCount,
        isCartBouncing
      }}
    >
      {children}

      {/* Flying Food Items Overlay */}
      {typeof document !== 'undefined' &&
        flyingItems.length > 0 &&
        createPortal(
          <div className="fixed inset-0 pointer-events-none z-[9999999] overflow-hidden">
            {flyingItems.map((f) => (
              <div
                key={f.id}
                className="absolute"
                style={{
                  left: `${f.startX - 20}px`,
                  top: `${f.startY - 20}px`,
                  animation: f.isReverse
                    ? 'flyFromCart 0.62s cubic-bezier(0.22, 1, 0.36, 1) forwards'
                    : 'flyToCart 0.62s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                  willChange: 'transform, opacity',
                  '--target-x': `${f.endX - f.startX}px`,
                  '--target-y': `${f.endY - f.startY}px`
                }}
              >
                <div
                  className={`relative w-10 h-10 rounded-full overflow-hidden shadow-2xl border-2 bg-white ring-4 flex items-center justify-center transition-transform ${
                    f.isReverse
                      ? 'border-rose-500 ring-rose-400/30'
                      : 'border-orange-500 ring-orange-400/30'
                  }`}
                >
                  <img
                    src={f.image}
                    alt={f.name}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute bottom-0 inset-x-0 text-[9px] font-black text-white text-center leading-none py-0.5 ${
                      f.isReverse ? 'bg-rose-600' : 'bg-orange-600'
                    }`}
                  >
                    {f.isReverse ? '-1' : '+1'}
                  </span>
                </div>
              </div>
            ))}
          </div>,
          document.body
        )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

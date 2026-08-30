'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/context/cart-context';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartSheet() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
  } = useCart();

  // Disable body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        {/* Drawer Panel */}
        <div className="w-screen max-w-md transform bg-white shadow-2xl transition-all duration-300 flex flex-col h-full animate-slide-in">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="text-lg font-semibold text-neutral-900">Your Bag ({cartCount})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 -mr-1.5 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-neutral-100">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-neutral-300" />
                </div>
                <h3 className="text-base font-medium text-neutral-900 mb-1">Your bag is empty</h3>
                <p className="text-sm text-neutral-500 max-w-xs mb-6">
                  Looks like you haven&apos;t added any sneakers to your bag yet.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-neutral-900 text-white hover:bg-neutral-800 rounded-none transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  {/* Image */}
                  <div className="relative w-20 h-20 bg-neutral-50 border border-neutral-100 flex-shrink-0">
                    <img
                      src={item.shoe.images[0]}
                      alt={item.shoe.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-medium text-neutral-900 truncate">
                          {item.shoe.name}
                        </h4>
                        <p className="text-sm font-semibold text-neutral-900">
                          Rs. {(item.shoe.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Color: {item.selectedColor}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Size: EU {item.selectedSize}
                      </p>
                    </div>

                    {/* Quantity Selector & Delete */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-neutral-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-neutral-50 text-neutral-500"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-medium text-neutral-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-neutral-50 text-neutral-500"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer (Sticky) */}
          {cartItems.length > 0 && (
            <div className="px-6 py-5 bg-neutral-50 border-t border-neutral-100">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-neutral-600">Subtotal</span>
                <span className="text-lg font-bold text-neutral-900">Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <p className="text-xs text-neutral-500 mb-4">
                Shipping and taxes calculated at checkout. Free shipping on all standard orders.
              </p>
              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full py-3.5 text-center text-xs font-semibold uppercase tracking-widest bg-neutral-900 hover:bg-neutral-800 text-white rounded-none transition-colors duration-200"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full py-3 text-center text-xs font-semibold uppercase tracking-widest bg-transparent hover:bg-neutral-100 border border-neutral-950 text-neutral-900 rounded-none transition-colors duration-200"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

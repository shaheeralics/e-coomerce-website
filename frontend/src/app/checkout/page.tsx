'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/cart-context';
import { useAuth } from '@/lib/context/auth-context';
import { createOrder } from '@/lib/supabase/client';
import { ShoppingBag, ArrowLeft, CheckCircle2, CreditCard, Landmark, Loader2, Calendar } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  // Form input states
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');

  // Prefill details from auth session if available
  useEffect(() => {
    if (user) {
      setCustomerName(user.name);
      setEmail(user.email);
    }
  }, [user]);
  
  // Card details states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Process states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Computed fees
  const shippingFee = 0; // Free shipping
  const taxFee = Math.round(cartTotal * 0.08); // 8% estimated tax
  const grandTotal = cartTotal + shippingFee + taxFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);

    try {
      // Structure the order items for the database
      const items = cartItems.map(item => ({
        shoeId: item.shoe.id,
        shoeName: item.shoe.name,
        price: item.shoe.price,
        size: item.selectedSize,
        color: item.selectedColor,
        quantity: item.quantity,
      }));

      // Call our Supabase client API
      const result = await createOrder({
        customerName,
        email,
        address,
        city,
        postalCode,
        total: grandTotal,
        items,
        paymentMethod,
        userId: user?.userId || undefined
      });

      setCompletedOrder(result);
      clearCart(); // Empty the cart on successful order creation
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Order submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order is completed, show success state
  if (completedOrder) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-20 text-center flex-grow flex flex-col justify-center items-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-6 animate-scale-up">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        
        <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 mb-2">
          Payment Confirmed
        </span>
        <h1 className="text-3xl font-black uppercase tracking-widest text-neutral-900 mb-2">Order Confirmed!</h1>
        <p className="text-xs text-neutral-500 uppercase tracking-widest max-w-md leading-relaxed mb-6">
          Thank you for shopping at VELOCITY. Your order has been placed successfully and is being prepared for shipment.
        </p>

        {/* Order Details box */}
        <div className="w-full bg-neutral-50 border border-neutral-100 p-6 text-left space-y-4 mb-8">
          <div className="flex justify-between items-center text-xs border-b border-neutral-200/60 pb-3">
            <span className="font-bold text-neutral-400 uppercase tracking-wider">Order Reference</span>
            <span className="font-extrabold text-neutral-900">{completedOrder.id}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            <div>
              <span className="text-[10px] text-neutral-400 font-bold block mb-1">Deliver To</span>
              <span className="text-neutral-900 font-bold block">{completedOrder.customerName}</span>
              <span>{completedOrder.address}, {completedOrder.city}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 font-bold block mb-1">Estimated Arrival</span>
              <span className="text-neutral-900 font-bold flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-4 h-4 text-neutral-600" />
                3-5 Business Days
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs pt-3 border-t border-neutral-200/60 font-bold">
            <span className="text-neutral-500 uppercase tracking-wider">Amount Paid</span>
            <span className="text-neutral-900 text-sm font-black">Rs. {completedOrder.total.toLocaleString()}</span>
          </div>
        </div>

        <Link
          href="/shoes"
          className="px-8 py-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest transition-colors duration-200"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // If cart is empty, show empty state
  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center flex-grow flex flex-col justify-center items-center">
        <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 text-neutral-300" />
        </div>
        <h2 className="text-base font-semibold text-neutral-900 uppercase tracking-widest mb-1">Your cart is empty</h2>
        <p className="text-xs text-neutral-500 uppercase tracking-wider max-w-xs mb-6">
          You must add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/shoes"
          className="px-6 py-3 text-xs font-bold uppercase tracking-widest bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
        >
          Explore Sneakers
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
      <div className="mb-8">
        <Link
          href="/shoes"
          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-neutral-900 mt-2">Checkout</h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Checkout details (cols: 7) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Shipping Information */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-100 pb-2">
              01. Shipping Address
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 text-xs uppercase tracking-wider focus:outline-hidden focus:border-neutral-900 bg-white"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 text-xs lowercase focus:outline-hidden focus:border-neutral-900 bg-white"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="123 Velocity St, Apt 4"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 text-xs uppercase tracking-wider focus:outline-hidden focus:border-neutral-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  required
                  placeholder="New York"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 text-xs uppercase tracking-wider focus:outline-hidden focus:border-neutral-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="10001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 text-xs uppercase tracking-wider focus:outline-hidden focus:border-neutral-900 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-100 pb-2">
              02. Payment Selector
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 border flex flex-col items-center gap-2 font-bold uppercase tracking-widest text-[10px] text-center transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-neutral-950 bg-neutral-950 text-white'
                    : 'border-neutral-200 hover:border-neutral-950 bg-white text-neutral-600'
                }`}
              >
                <Landmark className="w-5 h-5" />
                <span>Cash on Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 border flex flex-col items-center gap-2 font-bold uppercase tracking-widest text-[10px] text-center transition-all ${
                  paymentMethod === 'card'
                    ? 'border-neutral-950 bg-neutral-950 text-white'
                    : 'border-neutral-200 hover:border-neutral-950 bg-white text-neutral-600'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Credit Card</span>
              </button>
            </div>

            {/* Credit Card Input details */}
            {paymentMethod === 'card' && (
              <div className="p-5 border border-neutral-200 bg-neutral-50/50 space-y-4 animate-fade-in">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="4111 2222 3333 4444"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-4 py-2.5 border border-neutral-200 text-xs focus:outline-hidden focus:border-neutral-900 bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM / YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-200 text-xs text-center focus:outline-hidden focus:border-neutral-900 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-200 text-xs text-center focus:outline-hidden focus:border-neutral-900 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review (cols: 5) */}
        <div className="lg:col-span-5 bg-neutral-50 border border-neutral-100 p-6 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-b border-neutral-200/60 pb-3">
            Order Review
          </h2>

          {/* Items Summary list */}
          <div className="divide-y divide-neutral-200/60 max-h-72 overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div key={item.id} className="py-3.5 flex gap-4 first:pt-0">
                <div className="w-14 h-14 bg-neutral-100 flex-shrink-0 border border-neutral-200/60 relative">
                  <img
                    src={item.shoe.images[0]}
                    alt={item.shoe.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800 truncate uppercase tracking-wider">{item.shoe.name}</h4>
                    <p className="text-[10px] text-neutral-400 font-semibold mt-0.5 uppercase tracking-wider">
                      Size: EU {item.selectedSize} | Color: {item.selectedColor}
                    </p>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase text-neutral-500">
                    <span>Qty: {item.quantity}</span>
                    <span className="text-neutral-900 font-extrabold">Rs. {(item.shoe.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Breakdowns */}
          <div className="border-t border-neutral-200/60 pt-4 space-y-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500">
            <div className="flex justify-between">
              <span>Cart Subtotal</span>
              <span className="text-neutral-900 font-extrabold">Rs. {cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Standard Shipping</span>
              <span className="text-emerald-600 font-extrabold">FREE</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax (8%)</span>
              <span className="text-neutral-900 font-extrabold">Rs. {taxFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-neutral-900 text-sm font-black pt-2 border-t border-neutral-200/60 uppercase">
              <span>Total Price</span>
              <span>Rs. {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors duration-200 disabled:bg-neutral-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing Order...
              </>
            ) : (
              'Place Order'
            )}
          </button>
        </div>

      </form>
    </div>
  );
}

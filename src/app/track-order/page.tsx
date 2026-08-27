'use client';

import React, { useState } from 'react';
import { getOrderByTrackingAction } from '@/lib/actions';
import { Order } from '@/types';
import { Search, Loader2, Package, Truck, CheckCircle2, Calendar, ClipboardList } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !emailOrPhone) return;

    setLoading(true);
    setSearched(true);
    setOrder(null);

    try {
      const data = await getOrderByTrackingAction(orderId.trim(), emailOrPhone.trim());
      setOrder(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setOrderId('');
    setEmailOrPhone('');
    setOrder(null);
    setSearched(false);
  };

  // Determine timeline progress step
  const getStatusStep = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'pending') return 1;
    if (s === 'processing') return 2;
    if (s === 'shipped') return 3;
    if (s === 'delivered' || s === 'completed') return 4;
    return 1;
  };

  const currentStep = order ? getStatusStep(order.status) : 1;

  const timelineSteps = [
    { title: 'Order Placed', desc: 'Pending verification', icon: ClipboardList },
    { title: 'Processing', desc: 'Preparing package', icon: Package },
    { title: 'In Transit', desc: 'Shipped from hub', icon: Truck },
    { title: 'Delivered', desc: 'Arrival at destination', icon: CheckCircle2 }
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 flex-grow w-full flex flex-col font-sans">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Order Services</span>
        <h1 className="text-3xl font-black uppercase tracking-widest text-neutral-900 mt-1 mb-2">Track Your Order</h1>
        <p className="text-xs text-neutral-500 uppercase tracking-wider leading-relaxed">
          Input your order number and billing credentials to review real-time delivery status updates.
        </p>
      </div>

      {!order && (
        <div className="max-w-md mx-auto w-full bg-white border border-neutral-200 p-8 shadow-xs">
          <form onSubmit={handleTrack} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Order ID
              </label>
              <input
                type="text"
                required
                placeholder="e.g. order_xxxxxxxx"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-200 text-xs focus:outline-hidden focus:border-neutral-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Billing Email / Phone Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. customer@example.com or +92300xxxxxxx"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-200 text-xs focus:outline-hidden focus:border-neutral-900 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:bg-neutral-400 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Fetching order data...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Track Order
                </>
              )}
            </button>
          </form>

          {searched && !loading && !order && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 text-center text-xs font-bold uppercase tracking-wider text-red-500">
              No matching order record found. Please verify details.
            </div>
          )}
        </div>
      )}

      {order && (
        <div className="space-y-8 animate-fade-in">
          {/* Order Header info block */}
          <div className="bg-neutral-900 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Tracking Reference</span>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider font-mono mt-0.5">{order.id}</h2>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Placed: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex flex-col md:items-end">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5"> Fulfill Stage</span>
              <span className="px-4 py-1.5 text-xs font-black uppercase tracking-widest bg-white text-neutral-950 border border-white">
                {order.status}
              </span>
            </div>
          </div>

          {/* Visual Tracking Progress Timeline */}
          <div className="bg-white border border-neutral-100 p-6 md:p-10">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900 mb-8 border-b pb-3">Delivery Progress</h3>
            
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4">
              {/* Connecting line */}
              <div className="absolute left-[18px] md:left-0 top-0 md:top-[18px] w-0.5 md:w-full h-full md:h-0.5 bg-neutral-150 -z-1" />
              <div 
                className="absolute left-[18px] md:left-0 top-0 md:top-[18px] w-0.5 md:w-full h-[calc(100%-40px)] md:h-0.5 bg-neutral-900 -z-1 transition-all duration-500" 
                style={{
                  height: typeof window !== 'undefined' && window.innerWidth < 768 
                    ? `${((currentStep - 1) / 3) * 100}%` 
                    : '2px',
                  width: typeof window !== 'undefined' && window.innerWidth >= 768 
                    ? `${((currentStep - 1) / 3) * 100}%` 
                    : '2px',
                }}
              />

              {timelineSteps.map((step, idx) => {
                const stepNum = idx + 1;
                const isCompleted = stepNum < currentStep;
                const isActive = stepNum === currentStep;
                const Icon = step.icon;

                return (
                  <div key={idx} className="flex md:flex-col items-center gap-4 md:text-center relative z-10 w-full md:w-auto">
                    <div 
                      className={`w-9.5 h-9.5 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-neutral-900 border-neutral-900 text-white' 
                          : isActive 
                            ? 'bg-white border-neutral-900 text-neutral-900 ring-4 ring-neutral-100' 
                            : 'bg-white border-neutral-200 text-neutral-400'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </div>

                    <div className="space-y-0.5 text-left md:text-center">
                      <h4 className={`text-xs font-black uppercase tracking-wider ${isActive ? 'text-neutral-900' : 'text-neutral-700'}`}>
                        {step.title}
                      </h4>
                      <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items Summary list & Delivery details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Items summary */}
            <div className="md:col-span-7 bg-white border border-neutral-100 p-6 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900 border-b pb-3">Items Summary</h3>
              <div className="divide-y divide-neutral-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3.5 flex justify-between items-center first:pt-0">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">{item.shoeName}</h4>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">
                        Size: EU {item.size} | Color: {item.color} | Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-neutral-900">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-150 pt-4 flex justify-between items-center text-xs font-black uppercase tracking-wider text-neutral-900">
                <span>Fulfillment Total</span>
                <span className="text-sm font-black">Rs. {order.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery address details */}
            <div className="md:col-span-5 bg-neutral-50 border border-neutral-100 p-6 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900 border-b pb-3">Delivery Address</h3>
              
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-700 space-y-2.5 leading-relaxed">
                <div>
                  <span className="text-[9px] text-neutral-400 font-bold block">Customer name</span>
                  <span className="text-neutral-900 font-extrabold">{order.customerName}</span>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400 font-bold block">Shipping address</span>
                  <span className="text-neutral-900 font-extrabold block">{order.address}</span>
                  <span className="text-neutral-900 font-extrabold block">{order.city}, {order.postalCode}</span>
                </div>
                {order.customerPhone && (
                  <div>
                    <span className="text-[9px] text-neutral-400 font-bold block">Phone number</span>
                    <span className="text-neutral-900 font-extrabold">{order.customerPhone}</span>
                  </div>
                )}
                <div>
                  <span className="text-[9px] text-neutral-400 font-bold block">Email address</span>
                  <span className="text-neutral-900 font-extrabold lowercase tracking-normal">{order.email}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200">
                <button
                  onClick={resetSearch}
                  className="w-full text-center py-2.5 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Track Another Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

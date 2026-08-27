'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { fetchCustomerOrdersAction } from '@/lib/auth-actions';
import { Order } from '@/types';
import { ShoppingBag, LogOut, Package, Clock, User, Mail, CreditCard, ChevronRight } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Load orders if user is authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadOrders() {
      if (user) {
        setOrdersLoading(true);
        try {
          const fetchedOrders = await fetchCustomerOrdersAction();
          setOrders(fetchedOrders);
        } catch (error) {
          console.error('Failed to load customer orders:', error);
        } finally {
          setOrdersLoading(false);
        }
      }
    }
    loadOrders();
  }, [user]);

  if (loading || (!user && loading)) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-neutral-200" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Loading Account...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 font-sans">
      
      {/* Upper Profile Banner Header */}
      <div className="border border-neutral-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 shadow-xs bg-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-neutral-900 text-white flex items-center justify-center font-black uppercase text-lg">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-lg font-black uppercase tracking-wider text-neutral-950 flex items-center gap-2">
              {user.name}
            </h1>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
              {user.email}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-[9px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Panel Content (Orders List) */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-neutral-950 flex items-center gap-2">
            <Package className="w-4 h-4 text-neutral-400" />
            Order History ({orders.length})
          </h2>
        </div>

        {ordersLoading ? (
          <div className="py-12 text-center animate-pulse text-xs font-bold uppercase tracking-widest text-neutral-400">
            Fetching order logs...
          </div>
        ) : orders.length === 0 ? (
          <div className="border border-dashed border-neutral-200 p-12 text-center">
            <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">No orders found</h3>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-6">
              You haven't placed any orders with us yet.
            </p>
            <Link
              href="/shoes"
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-[9px] font-bold uppercase tracking-widest transition-colors"
            >
              <span>Browse Catalog</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="border border-neutral-100 hover:border-neutral-200 transition-colors shadow-sm bg-white"
              >
                {/* Header status bar */}
                <div className="bg-neutral-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-100 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                    <div>
                      <span className="text-[10px] text-neutral-400 font-bold block mb-0.5">Order Ref</span>
                      <span className="font-extrabold text-neutral-950">{order.id}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 font-bold block mb-0.5">Date Placed</span>
                      <span className="text-neutral-700">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 font-bold block mb-0.5">Payment</span>
                      <span className="text-neutral-700 flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
                        {order.paymentMethod === 'cod' ? 'COD' : 'CARD'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 font-bold block mb-0.5 text-left sm:text-right">Status</span>
                    <span 
                      className={`inline-block px-2.5 py-0.5 text-[9px] font-black tracking-widest ${
                        order.status === 'completed' || order.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-700'
                          : order.status === 'cancelled'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items and Address Panel */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Items list */}
                  <div className="md:col-span-2 space-y-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block border-b border-neutral-100 pb-1">
                      Ordered Items
                    </span>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-neutral-900">{item.shoeName}</p>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5">
                            Size {item.size} • {item.color} • Qty {item.quantity}
                          </p>
                        </div>
                        <span className="font-extrabold text-neutral-950">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery address details & summary */}
                  <div className="bg-neutral-50 p-4 border border-neutral-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block border-b border-neutral-200/60 pb-1 mb-2">
                        Delivery Address
                      </span>
                      <p className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider leading-relaxed">
                        {order.customerName} <br />
                        {order.address}, {order.city} <br />
                        {order.postalCode}
                      </p>
                    </div>

                    <div className="border-t border-neutral-200/60 pt-3 mt-4 flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Total Paid</span>
                      <span className="text-sm font-black text-neutral-950">
                        Rs. {order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

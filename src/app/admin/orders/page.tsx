'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { fetchOrders, changeOrderStatus } from './actions';
import { Order } from '@/types';
import { Search, ShoppingBag, Eye, X, Phone, Mail, MapPin, CreditCard, Landmark, Check } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Selected order details drawer
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Track status update loading
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await changeOrderStatus(orderId, newStatus);
      if (res.success) {
        // Refresh local orders list
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, status: newStatus.toLowerCase() as any } : o))
        );
        // Sync selected order drawer if open
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus.toLowerCase() as any } : null);
        }
      } else {
        alert('Failed to update status.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filter & Search computation
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const statusColors: Record<string, string> = {
    pending: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    processing: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    shipped: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    completed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    delivered: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    cancelled: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  return (
    <div className="space-y-8 max-w-7xl relative">
      {/* Page Title */}
      <div>
        <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Inventory Logs</span>
        <h1 className="text-2xl font-black uppercase tracking-widest text-white mt-1">Order Management</h1>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-neutral-950 p-4 border border-neutral-800">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by customer, ID or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-neutral-700 uppercase tracking-wider"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {['All', 'Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'].map(status => {
            const isSelected = statusFilter === status.toLowerCase();
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status.toLowerCase())}
                className={`px-3.5 py-2 text-[9px] font-bold uppercase tracking-wider transition-colors border ${
                  isSelected
                    ? 'bg-white border-white text-neutral-950 shadow-xs'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Grid/Table */}
      <div className="bg-neutral-950 border border-neutral-800 p-6">
        {loading ? (
          <div className="py-20 text-center text-neutral-500 uppercase tracking-widest animate-pulse">
            Loading order records...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-neutral-500 border border-dashed border-neutral-850">
            <ShoppingBag className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
            <p className="text-xs uppercase tracking-widest">No matching orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                  <th className="pb-3">Reference ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">City</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Date Placed</th>
                  <th className="pb-3">Order Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850/30 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-neutral-900/10">
                    
                    {/* ID */}
                    <td className="py-4 font-mono text-[11px] text-white">
                      {order.id}
                    </td>

                    {/* Customer */}
                    <td className="py-4">
                      <div>
                        <div className="text-white">{order.customerName}</div>
                        <div className="text-[10px] text-neutral-500 lowercase tracking-normal mt-0.5">{order.email}</div>
                      </div>
                    </td>

                    {/* City */}
                    <td className="py-4">{order.city}</td>

                    {/* Total */}
                    <td className="py-4 text-white font-extrabold">Rs. {order.total.toLocaleString()}</td>

                    {/* Date */}
                    <td className="py-4 text-neutral-400 font-medium text-[10px]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4">
                      <div className="relative inline-block text-left">
                        <select
                          disabled={updatingOrderId === order.id}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`appearance-none bg-neutral-900 border rounded-xs px-3 py-1.5 pr-8 text-[9px] font-bold uppercase tracking-wider focus:outline-hidden focus:border-white cursor-pointer transition-colors ${
                            statusColors[order.status] || 'text-neutral-400 border-neutral-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    {/* View Action */}
                    <td className="py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:text-white rounded-xs transition-colors inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-neutral-400"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Slide-Over Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden flex bg-neutral-950/65 backdrop-blur-xs justify-end animate-fade-in">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={() => setSelectedOrder(null)} />

          <div className="relative w-full max-w-lg bg-neutral-950 border-l border-neutral-800 flex flex-col h-full shadow-2xl animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 bg-neutral-950">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Order Inspector</span>
                <h2 className="text-sm font-black text-white uppercase tracking-wider">Ref: {selectedOrder.id}</h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-full bg-neutral-900 hover:bg-neutral-855 border border-neutral-800 transition-all"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Scrollable Contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 select-none">
              
              {/* Customer Box */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">01. Customer Dossier</h3>
                <div className="p-4 bg-neutral-900 border border-neutral-850 space-y-3 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Mail className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="lowercase tracking-normal">{selectedOrder.email}</span>
                  </div>
                  {selectedOrder.customerPhone && (
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Phone className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{selectedOrder.customerPhone || 'N/A'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Box */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">02. Destination Address</h3>
                <div className="p-4 bg-neutral-900 border border-neutral-850 space-y-3 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  <div className="flex gap-2">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white">{selectedOrder.address}</p>
                      <p className="text-[10px] text-neutral-400 mt-1">{selectedOrder.city}, {selectedOrder.postalCode}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Box */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">03. Transaction & Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-900 border border-neutral-850 flex items-center gap-3">
                    {selectedOrder.paymentMethod === 'card' ? <CreditCard className="w-5 h-5 text-neutral-400" /> : <Landmark className="w-5 h-5 text-neutral-400" />}
                    <div>
                      <span className="text-[9px] text-neutral-500 font-bold block">Method</span>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">{selectedOrder.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-900 border border-neutral-850 flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${selectedOrder.status === 'completed' || selectedOrder.status === 'delivered' ? 'bg-emerald-500' : selectedOrder.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'}`} />
                    <div>
                      <span className="text-[9px] text-neutral-500 font-bold block">Status</span>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">{selectedOrder.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List Box */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">04. Itemized Lines</h3>
                <div className="border border-neutral-850 bg-neutral-900 divide-y divide-neutral-850">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-4 flex justify-between items-center gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">{item.shoeName}</h4>
                        <p className="text-[10px] text-neutral-500 font-bold mt-1 uppercase tracking-wider">
                          Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-white">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        <span className="text-[9px] text-neutral-500 font-semibold block mt-0.5">@ Rs. {item.price.toLocaleString()} each</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Sticky Actions Footer */}
            <div className="p-6 border-t border-neutral-800 bg-neutral-950 flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-neutral-400">
                <span>Sum total</span>
                <span className="text-base font-black text-white">Rs. {selectedOrder.total.toLocaleString()}</span>
              </div>
              
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, 'completed')}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Complete</span>
                </button>
                <button
                  onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                  className="flex-1 py-3 bg-red-900/30 hover:bg-red-900/50 border border-red-500/20 hover:border-red-500/40 text-red-400 text-[10px] font-bold uppercase tracking-widest transition-colors"
                >
                  <span>Cancel Order</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

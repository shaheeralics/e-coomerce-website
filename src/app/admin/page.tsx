'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchOrders } from './orders/actions';
import { fetchShoesList } from './products/actions';
import { Shoe, Order } from '@/types';
import { AlertTriangle, ArrowRight, ExternalLink, Plus, Loader2 } from 'lucide-react';
import DashboardCharts from '@/components/admin/DashboardCharts';

export default function AdminOverviewPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [totalCustomersCount, setTotalCustomersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const fetchedOrders = await fetchOrders();
        const fetchedShoes = await fetchShoesList();
        setOrders(fetchedOrders);
        setShoes(fetchedShoes);

        // Fetch metrics from backend API
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        const stockRes = await fetch(`${API_URL}/api/shoes/low-stock-count`, { credentials: 'include' });
        const stockData = await stockRes.json();
        setLowStockCount(stockData.count || 0);

        const customersRes = await fetch(`${API_URL}/api/admin/customers-count`, { credentials: 'include' });
        const customersData = await customersRes.json();
        setTotalCustomersCount(customersData.count || 0);
      } catch (error) {
        console.error('Failed to load dashboard statistics:', error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-neutral-550 uppercase tracking-widest text-xs flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading dashboard analytics...</span>
      </div>
    );
  }

  // 1. Compute metrics for non-cancelled orders
  const nonCancelledOrders = orders.filter(o => o.status !== 'cancelled');
  const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + o.total, 0);

  // 2. Compute daily revenue trend (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  }).reverse();

  const revenueTrend = last7Days.map(dateStr => {
    const dayOrders = nonCancelledOrders.filter(o => {
      const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
      return orderDate === dateStr;
    });
    const amount = dayOrders.reduce((sum, o) => sum + o.total, 0);
    const dateObj = new Date(dateStr + 'T00:00:00');
    const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    return { date: label, amount };
  });

  // 3. Compute top-selling products (by quantity)
  const productSales: Record<string, { name: string; quantity: number }> = {};
  nonCancelledOrders.forEach(order => {
    order.items.forEach(item => {
      const id = item.shoeId;
      if (!productSales[id]) {
        productSales[id] = { name: item.shoeName, quantity: 0 };
      }
      productSales[id].quantity += item.quantity;
    });
  });
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // 4. Compute KPIs
  const activeOrdersCount = orders.filter(o => 
    ['pending', 'processing', 'shipped'].includes(o.status.toLowerCase())
  ).length;

  // Get recent 5 orders for log
  const recentOrders = orders.slice(0, 5);

  const statusColors: Record<string, string> = {
    pending: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    processing: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    shipped: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    completed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    delivered: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    cancelled: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Title Header */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Velocity Systems</span>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white mt-1">Dashboard Overview</h1>
        </div>
      </div>

      {/* Dynamic Inventory Warning Banner */}
      {lowStockCount > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 flex items-center justify-between text-amber-400 text-xs font-bold uppercase tracking-widest select-none shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>Inventory Alert: {lowStockCount} product sizes are running low on stock!</span>
          </div>
          <Link href="/admin/products" className="underline hover:text-amber-300 transition-colors">
            Review Stock Matrix
          </Link>
        </div>
      )}

      {/* KPI Cards & Charts Visualizations */}
      <DashboardCharts 
        revenueTrend={revenueTrend} 
        topProducts={topProducts} 
        kpis={{
          totalSales: totalRevenue,
          activeOrders: activeOrdersCount,
          totalCustomers: totalCustomersCount
        }} 
      />

      {/* Grid: Actions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Recent Orders Table (cols: 8) */}
        <div className="lg:col-span-8 bg-neutral-950 border border-neutral-800 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-850 text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850/30 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-900/10">
                    <td className="py-4 text-white font-black font-mono tracking-normal">{order.id}</td>
                    <td className="py-4">
                      <div>
                        <div>{order.customerName}</div>
                        <div className="text-[9px] text-neutral-500 lowercase tracking-normal">{order.email}</div>
                      </div>
                    </td>
                    <td className="py-4 font-bold text-white">Rs. {order.total.toLocaleString()}</td>
                    <td className="py-4 text-right">
                      <span className={`px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-widest border ${
                        statusColors[order.status.toLowerCase()] || 'text-neutral-400 border-neutral-800 bg-neutral-900/10'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Settings Portal (cols: 4) */}
        <div className="lg:col-span-4 bg-neutral-950 border border-neutral-800 p-6 space-y-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-white">Quick Control</h2>
            <p className="text-[10px] text-neutral-500 uppercase mt-1">Direct shortcuts to admin services</p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/admin/products"
              className="p-4 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 transition-all flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white select-none"
            >
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-neutral-450" />
                Add New Product
              </span>
              <ArrowRight className="w-4 h-4 text-neutral-500" />
            </Link>

            <Link
              href="/admin/pages-categories"
              className="p-4 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 transition-all flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white select-none"
            >
              <span>Manage Web Pages</span>
              <ArrowRight className="w-4 h-4 text-neutral-500" />
            </Link>

            <Link
              href="/"
              target="_blank"
              className="p-4 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 transition-all flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white select-none"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-neutral-450" />
                Preview Storefront
              </span>
              <ArrowRight className="w-4 h-4 text-neutral-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

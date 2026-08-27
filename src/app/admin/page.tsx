import React from 'react';
import Link from 'next/link';
import { getDbOrders, getDbShoes } from '@/lib/mysql-store';
import { testConnection, query } from '@/lib/db';
import { AlertTriangle, ArrowRight, ExternalLink, Plus } from 'lucide-react';
import DashboardCharts from '@/components/admin/DashboardCharts';

export const revalidate = 0; // Disable server cache for real-time analytics

export default async function AdminOverviewPage() {
  const orders = await getDbOrders();
  const shoes = await getDbShoes();
  const isOnline = await testConnection();

  // 1. Compute metrics for non-cancelled orders
  const nonCancelledOrders = orders.filter(o => o.status !== 'cancelled');
  const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + o.total, 0);
  const uniqueEmails = new Set(orders.map(o => o.email.toLowerCase()));
  const activeCustomers = uniqueEmails.size;

  // 2. Compute low stock count (stock < 5)
  let lowStockCount = 0;
  if (isOnline) {
    try {
      const results = await query<{ count: number }[]>('SELECT COUNT(*) as count FROM product_variants WHERE stock_quantity < 5 AND stock_quantity >= 0');
      lowStockCount = results[0]?.count || 0;
    } catch {
      lowStockCount = 2; // Default mock fallback count
    }
  } else {
    shoes.forEach(s => {
      const missingCount = 11 - s.sizes.length;
      lowStockCount += missingCount;
    });
  }

  // 3. Compute daily revenue trend (last 7 days)
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

  // 4. Compute top-selling products (by quantity)
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

  // 5. Compute KPIs
  const activeOrdersCount = orders.filter(o => 
    ['pending', 'processing', 'shipped'].includes(o.status.toLowerCase())
  ).length;

  let totalCustomersCount = activeCustomers;
  if (isOnline) {
    try {
      const result = await query<{ count: number }[]>('SELECT COUNT(*) as count FROM users WHERE role = "customer"');
      totalCustomersCount = result[0]?.count || activeCustomers;
    } catch {
      totalCustomersCount = activeCustomers;
    }
  }

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
              <span>Manage Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Placed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/40 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500 uppercase">
                      No orders placed yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-900/20 group">
                      <td className="py-4 font-mono text-[11px] text-white">
                        <Link href="/admin/orders" className="hover:underline flex items-center gap-1">
                          {order.id}
                        </Link>
                      </td>
                      <td className="py-4">{order.customerName}</td>
                      <td className="py-4 text-white font-extrabold">${order.total}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border rounded-xs ${statusColors[order.status] || 'text-neutral-400 border-neutral-800'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-right text-neutral-500 font-medium text-[10px]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick actions panel (cols: 4) */}
        <div className="lg:col-span-4 bg-neutral-950 border border-neutral-800 p-6 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white">Quick Tasks</h2>
          
          <div className="space-y-3">
            <Link
              href="/admin/products?action=add"
              className="w-full flex items-center justify-between p-4 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 transition-all font-bold uppercase tracking-widest text-[10px] text-white"
            >
              <span>Add New Product</span>
              <Plus className="w-4 h-4" />
            </Link>

            <Link
              href="/admin/products"
              className="w-full flex items-center justify-between p-4 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 transition-all font-bold uppercase tracking-widest text-[10px] text-white"
            >
              <span>View Inventory Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="http://localhost/phpmyadmin"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-neutral-900/50 border border-dashed border-neutral-800 hover:border-neutral-700 transition-all font-bold uppercase tracking-widest text-[10px] text-neutral-400 hover:text-white"
            >
              <span>Open phpMyAdmin</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

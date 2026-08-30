'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Package, ArrowUpRight, ShieldCheck, Database, LogOut, Users, MapPin, ClipboardList } from 'lucide-react';
import { customerLogoutAction } from '@/lib/auth-actions';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDbOnline, setIsDbOnline] = useState(true);

  // Check database status using backend health/shoes fetch on mount
  useEffect(() => {
    async function checkDb() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/categories`);
        setIsDbOnline(res.ok);
      } catch (err) {
        setIsDbOnline(false);
      }
    }
    checkDb();
  }, []);

  const links = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Products & Stock', href: '/admin/products', icon: Package },
    { label: 'Pages & Categories', href: '/admin/pages-categories', icon: ClipboardList },
    { label: 'Store Locations', href: '/admin/store-locations', icon: MapPin },
    { label: 'Customers', href: '/admin/customers', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-neutral-900 text-neutral-100 overflow-hidden font-sans">
      {/* Sidebar Layout */}
      <aside className="w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col flex-shrink-0">
        
        {/* Sidebar Header */}
        <div className="h-16 px-6 border-b border-neutral-800 flex items-center gap-2 bg-neutral-950">
          <ShieldCheck className="w-5 h-5 text-neutral-100" />
          <span className="font-black text-sm tracking-widest text-white uppercase">Velocity Admin</span>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 py-6 px-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Panel Links */}
        <div className="p-4 border-t border-neutral-800 space-y-3">
          <Link
            href="/"
            className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-[10px] font-bold uppercase tracking-wider text-white border border-neutral-800 transition-colors"
          >
            <span>Live Storefront</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {/* Logout Button */}
          <button
            onClick={() => customerLogoutAction()}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-neutral-950 hover:bg-red-950/40 hover:text-red-400 hover:border-red-900/60 text-[10px] font-bold uppercase tracking-wider text-neutral-400 border border-neutral-800 transition-colors cursor-pointer"
          >
            <span>Logout Control</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>

          {/* Database Connectivity Status Indicator */}
          <div className="flex items-center gap-2.5 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            <div className={`w-2.5 h-2.5 rounded-full ${isDbOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3 text-neutral-500" />
              {isDbOnline ? 'MySQL Connected' : 'Sandbox DB Fallback'}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-neutral-900">
        
        {/* Header bar */}
        <header className="h-16 border-b border-neutral-800 flex items-center justify-between px-8 bg-neutral-950/40">
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Dashboard Control Centre</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold uppercase tracking-widest bg-neutral-800 text-neutral-300 px-3 py-1.5 border border-neutral-700">
              Admin Mode Sandbox
            </span>
          </div>
        </header>

        {/* Dynamic Pages Contents (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

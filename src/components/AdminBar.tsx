'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { LayoutDashboard, Plus, Edit3, Eye, LogOut, ShieldAlert } from 'lucide-react';

export default function AdminBar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Add layout shifting padding to body when admin bar is showing
  React.useEffect(() => {
    const isShowing = user && user.role === 'admin' && !pathname?.startsWith('/admin');
    if (isShowing) {
      document.body.classList.add('admin-bar-active');
    } else {
      document.body.classList.remove('admin-bar-active');
    }
    return () => {
      document.body.classList.remove('admin-bar-active');
    };
  }, [user, pathname]);

  // Show only if user is logged in as admin and we are NOT on the admin dashboard pages
  if (!user || user.role !== 'admin' || pathname?.startsWith('/admin')) {
    return null;
  }

  // Determine if we are on a specific shoe details page
  const isShoePage = pathname?.startsWith('/shoes/') && pathname !== '/shoes';
  let editProductSlug = '';
  if (isShoePage) {
    // Extract slug from e.g. /shoes/velocity-stratus-v1
    editProductSlug = pathname.split('/').pop() || '';
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-10 bg-neutral-950 text-neutral-300 border-b border-neutral-905 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-50 select-none text-[11px] font-bold uppercase tracking-wider font-sans shadow-md">
      {/* Left side actions */}
      <div className="flex items-center gap-5">
        <Link 
          href="/admin" 
          className="flex items-center gap-1.5 text-white hover:text-white transition-colors"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 stroke-[2]" />
          <span className="font-black tracking-widest text-[10px]">VELOCITY CONTROL</span>
        </Link>
        
        <span className="h-4 w-[1px] bg-neutral-800" />

        <div className="flex items-center gap-4">
          <Link 
            href="/admin" 
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          {isShoePage && editProductSlug ? (
            <Link 
              href={`/admin/products?action=edit&id=${editProductSlug}`} 
              className="flex items-center gap-1 hover:text-white text-amber-400 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Product</span>
            </Link>
          ) : (
            <Link 
              href="/admin/products?action=add" 
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </Link>
          )}

          <Link 
            href="/" 
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Storefront</span>
          </Link>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        <span className="text-[10px] text-neutral-400 hidden md:inline lowercase font-mono">
          logged in as <span className="text-neutral-200 font-bold uppercase font-sans tracking-wide">{user.name}</span>
        </span>
        
        <button
          onClick={() => {
            if (confirm('Are you sure you want to log out of Admin Session?')) {
              logout();
            }
          }}
          className="flex items-center gap-1 hover:text-red-400 text-neutral-400 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

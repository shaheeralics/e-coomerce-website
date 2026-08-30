'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/context/cart-context';
import { useWishlist } from '@/lib/context/wishlist-context';
import { useAuth } from '@/lib/context/auth-context';
import CartSheet from './ui/CartSheet';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  ArrowRight, 
  User as UserIcon, 
  Heart, 
  MapPin, 
  Search, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { getCategorySettingsAction, getCustomPagesAction } from '@/lib/actions';
import { CustomPage } from '@/types';
import { customerLogoutAction } from '@/lib/auth-actions';

export default function Header() {
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistItems } = useWishlist();
  const { user } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [categories, setCategories] = useState<{ category_name: string; is_visible: boolean }[]>([]);
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const pathname = usePathname();

  // Load dynamic navigation options on mount
  useEffect(() => {
    async function loadNavData() {
      try {
        const [cats, pages] = await Promise.all([
          getCategorySettingsAction(),
          getCustomPagesAction()
        ]);
        setCategories(cats);
        setCustomPages(pages.filter(p => p.isPublished));
      } catch (err) {
        console.error('Failed to load navigation options:', err);
      }
    }
    loadNavData();
  }, [pathname]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Map category setting names to paths
  const categoryPaths: Record<string, string> = {
    'Men': '/shoes?gender=men',
    'Women': '/shoes?gender=women',
    'Kids': '/shoes?gender=kids',
    'Running': '/shoes?category=running',
    'Casual': '/shoes?category=casual',
    'Limited Drops': '/shoes?category=limited'
  };

  const dynamicLinks = [{ label: 'Shop All', href: '/shoes' }];
  categories.forEach(cat => {
    if (cat.is_visible && categoryPaths[cat.category_name]) {
      dynamicLinks.push({
        label: cat.category_name,
        href: categoryPaths[cat.category_name]
      });
    }
  });

  const finalNavLinks = dynamicLinks.length > 1 ? dynamicLinks : [
    { label: 'Shop All', href: '/shoes' },
    { label: 'Men', href: '/shoes?gender=men' },
    { label: 'Women', href: '/shoes?gender=women' },
    { label: 'Kids', href: '/shoes?gender=kids' },
    { label: 'Running', href: '/shoes?category=running' },
    { label: 'Casual', href: '/shoes?category=casual' },
    { label: 'Limited Drops', href: '/shoes?category=limited' }
  ];

  return (
    <>
      {/* Top Banner Promo */}
      <div className="bg-neutral-900 text-white py-2 text-center text-[10px] md:text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5 px-4">
        <span>Free standard shipping & 30-day returns on all orders</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md transition-all duration-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left Hamburger menu trigger */}
            <div className="flex">
              <button
                type="button"
                className="-ml-2 p-2 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                onClick={() => setIsDrawerOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 md:flex-none text-center md:ml-6">
              <Link
                href="/"
                className="text-2xl font-black tracking-widest text-neutral-950 font-sans"
              >
                VELOCITY
              </Link>
            </div>

            {/* Desktop Navigation (horizontal) */}
            <nav className="hidden lg:flex space-x-8">
              {finalNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-[10px] font-bold uppercase tracking-widest hover:text-neutral-950 transition-colors py-1 border-b-2 ${
                      isActive ? 'border-neutral-950 text-neutral-950' : 'border-transparent text-neutral-500'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Cart & Utility icons */}
            <div className="flex items-center gap-1.5">
              <Link
                href={user ? '/profile' : '/login'}
                className="p-2 text-neutral-600 hover:text-neutral-950 transition-colors flex items-center gap-1"
                aria-label={user ? 'View profile' : 'Login'}
              >
                <UserIcon className="w-5 h-5 stroke-[1.8]" />
                {user && (
                  <span className="hidden sm:inline text-[9px] font-bold uppercase tracking-wider text-neutral-700 hover:text-neutral-950">
                    {user.name.split(' ')[0]}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-neutral-600 hover:text-neutral-950 transition-colors"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5.5 h-5.5 stroke-[1.8]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-neutral-950 text-[9px] font-bold text-white leading-none scale-100 transition-transform">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Left-Side Slide-out Navigation Drawer Menu */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex bg-neutral-950/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in">
          {/* Backdrop Click */}
          <div className="absolute inset-0" onClick={() => setIsDrawerOpen(false)} />

          <div className="relative flex w-full max-w-sm flex-col bg-white pb-12 shadow-2xl animate-slide-left-in border-r border-neutral-100 h-full">
            {/* Drawer Header */}
            <div className="flex px-6 pt-6 pb-4 justify-between items-center border-b border-neutral-100 bg-neutral-50/50">
              <span className="text-xl font-black tracking-widest text-neutral-950 font-sans">VELOCITY</span>
              <button
                type="button"
                className="p-2 -mr-2 text-neutral-400 hover:text-neutral-950 rounded-full hover:bg-neutral-100 transition-all cursor-pointer"
                onClick={() => setIsDrawerOpen(false)}
              >
                <X className="w-5.5 h-5.5" />
              </button>
            </div>

            {/* Navigation Options list (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 select-none">
              
              {/* Product Categories */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                  Product Categories
                </span>
                <div className="space-y-1.5">
                  {finalNavLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsDrawerOpen(false)}
                      className="group flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-800 hover:text-neutral-950 transition-colors py-2.5 border-b border-neutral-50"
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 group-hover:text-neutral-900" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Information & Custom Pages */}
              {customPages.length > 0 && (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                    About Velocity
                  </span>
                  <div className="space-y-1.5">
                    {customPages.map((page) => (
                      <Link
                        key={page.id}
                        href={`/p/${page.slug}`}
                        onClick={() => setIsDrawerOpen(false)}
                        className="group flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-800 hover:text-neutral-950 transition-colors py-2.5 border-b border-neutral-50"
                      >
                        <span>{page.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Utility / Store Options */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                  Support & Shopping
                </span>
                <div className="space-y-2">
                  <Link
                    href="/store-locations"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:text-neutral-950 transition-colors py-2"
                  >
                    <MapPin className="w-4 h-4 text-neutral-500" />
                    <span>Store Locations</span>
                  </Link>

                  <Link
                    href="/track-order"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:text-neutral-950 transition-colors py-2"
                  >
                    <Search className="w-4 h-4 text-neutral-500" />
                    <span>Track Your Order</span>
                  </Link>

                  <Link
                    href="/wishlist"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-800 hover:text-neutral-950 transition-colors py-2"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-neutral-500" />
                      <span>My Wishlist</span>
                    </div>
                    {wishlistItems.length > 0 && (
                      <span className="bg-neutral-900 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>

            {/* Authentication Footer (Positioned at bottom) */}
            <div className="px-6 pt-4 border-t border-neutral-100 bg-neutral-50/50">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center text-white text-xs font-black">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-neutral-900 uppercase block truncate">{user.name}</span>
                      <span className="text-[10px] text-neutral-500 block truncate">{user.email}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex-1 text-center py-2.5 border border-neutral-200 text-neutral-800 hover:text-neutral-950 text-[10px] font-bold uppercase tracking-wider hover:bg-white transition-colors"
                    >
                      My Profile
                    </Link>
                    
                    <form action={customerLogoutAction} className="flex-1">
                      <button
                        type="submit"
                        className="w-full text-center py-2.5 border border-neutral-200 text-red-500 hover:text-red-600 hover:bg-red-50/30 text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-1">
                    Access your account profile
                  </p>
                  <Link
                    href="/login"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full text-center py-3 bg-neutral-900 text-white hover:bg-neutral-800 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Login / Register</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Cart Panel */}
      <CartSheet />
    </>
  );
}


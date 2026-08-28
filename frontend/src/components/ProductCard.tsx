'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shoe } from '@/types';
import { useCart } from '@/lib/context/cart-context';
import { useWishlist } from '@/lib/context/wishlist-context';
import { ShoppingBag, Star, Heart } from 'lucide-react';

interface ProductCardProps {
  shoe: Shoe;
}

export default function ProductCard({ shoe }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const activeWish = isInWishlist(shoe.id);

  const primaryImage = shoe.images[0];
  const secondaryImage = shoe.images[1] || shoe.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (shoe.sizes.length > 0 && shoe.colors.length > 0) {
      // Add default size (usually middle size or first size) and first color
      const defaultSize = shoe.sizes[Math.floor(shoe.sizes.length / 2)] || shoe.sizes[0];
      const defaultColor = shoe.colors[0];
      addToCart(shoe, defaultSize, defaultColor, 1);
    }
  };

  const badgeColors = {
    'New': 'bg-neutral-900 text-white',
    'Sale': 'bg-red-500 text-white',
    'Limited Drop': 'bg-amber-500 text-white',
    'Best Seller': 'bg-indigo-600 text-white',
  };

  return (
    <div
      className="group relative flex flex-col bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-50 border border-neutral-100">
        
        {/* Wishlist Heart Toggle */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(shoe);
          }}
          className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-white text-neutral-600 hover:text-red-500 rounded-full shadow-xs transition-colors duration-200 cursor-pointer"
          aria-label={activeWish ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 transition-all duration-300 ${activeWish ? 'fill-red-500 stroke-red-500 scale-110' : 'stroke-neutral-650'}`} />
        </button>

        {/* Badge */}
        {shoe.badge && (
          <span className={`absolute top-3 left-3 z-10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${badgeColors[shoe.badge]}`}>
            {shoe.badge}
          </span>
        )}

        {/* Product Images (Zoom and Toggle on Hover) */}
        <Link href={`/shoes/${shoe.id}`} className="block h-full w-full">
          <img
            src={isHovered ? secondaryImage : primaryImage}
            alt={shoe.name}
            className="h-full w-full object-cover object-center transition-all duration-700 ease-out scale-100 group-hover:scale-105"
          />
        </Link>

        {/* Quick Add Overlay Button */}
        {shoe.inStock && (
          <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out hidden md:block">
            <button
              onClick={handleQuickAdd}
              className="w-full bg-white/95 hover:bg-neutral-900 hover:text-white text-neutral-900 py-3 text-[10px] font-bold uppercase tracking-widest border border-neutral-200 shadow-sm flex items-center justify-center gap-2 transition-all duration-200"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Quick Add
            </button>
          </div>
        )}

        {/* Mobile quick add button */}
        {shoe.inStock && (
          <button
            onClick={handleQuickAdd}
            className="absolute right-3 bottom-3 md:hidden p-2.5 bg-white text-neutral-900 border border-neutral-200 shadow-xs flex items-center justify-center rounded-full"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        )}

        {/* Out of Stock Overlay */}
        {!shoe.inStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-neutral-900 text-white px-3.5 py-1.5">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="pt-4 pb-2 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider group-hover:underline">
            <Link href={`/shoes/${shoe.id}`}>{shoe.name}</Link>
          </h3>
          <div className="flex items-center gap-1 text-neutral-900">
            <Star className="w-3 h-3 fill-neutral-900 stroke-none" />
            <span className="text-[10px] font-bold">{shoe.rating}</span>
          </div>
        </div>

        <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider mt-0.5">
          {shoe.category}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-900">
            Rs. {shoe.price.toLocaleString()}
          </span>
          {shoe.originalPrice && (
            <span className="text-[10px] text-neutral-400 line-through font-semibold">
              Rs. {shoe.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

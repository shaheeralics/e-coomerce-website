'use client';

import React from 'react';
import { useWishlist } from '@/lib/context/wishlist-context';
import { useCart } from '@/lib/context/cart-context';
import Link from 'next/link';
import { Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (shoe: any) => {
    if (shoe.sizes.length > 0) {
      // Add first size and first color by default
      const defaultSize = shoe.sizes[Math.floor(shoe.sizes.length / 2)] || shoe.sizes[0];
      const defaultColor = shoe.colors[0] || 'Classic White';
      addToCart(shoe, defaultSize, defaultColor, 1);
      removeFromWishlist(shoe.id); // Move operation removes it from wishlist
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full flex flex-col font-sans">
      <div className="mb-8">
        <Link
          href="/shoes"
          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shop</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-neutral-900 mt-2">My Wishlist</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center flex-grow border border-dashed border-neutral-200 p-8 bg-neutral-50/30">
          <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mb-4 border border-neutral-100">
            <Heart className="w-7 h-7 text-neutral-300 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900 uppercase tracking-widest mb-1">Your wishlist is empty</h3>
          <p className="text-xs text-neutral-500 uppercase tracking-wider max-w-xs mb-6">
            You haven't saved any items yet. Explore the shop and toggle the heart icon to save sneakers here!
          </p>
          <Link
            href="/shoes"
            className="px-6 py-3 text-xs font-bold uppercase tracking-widest bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
          >
            Explore Sneakers
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((shoe) => (
            <div key={shoe.id} className="group relative flex flex-col bg-white border border-neutral-100 hover:shadow-xs transition-shadow duration-300">
              
              {/* Image box */}
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-50 border-b border-neutral-100">
                <Link href={`/shoes/${shoe.id}`} className="block h-full w-full">
                  <img
                    src={shoe.images[0]}
                    alt={shoe.name}
                    className="h-full w-full object-cover object-center transition-all duration-500 scale-100 group-hover:scale-103"
                  />
                </Link>
                
                {/* Remove button overlay */}
                <button
                  onClick={() => removeFromWishlist(shoe.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-red-500 hover:text-white text-neutral-500 rounded-full shadow-xs transition-colors duration-200 cursor-pointer"
                  aria-label="Remove item from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Shoe details block */}
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">
                    {shoe.category}
                  </span>
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider group-hover:underline">
                    <Link href={`/shoes/${shoe.id}`}>{shoe.name}</Link>
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs font-black text-neutral-950">Rs. {shoe.price.toLocaleString()}</span>
                    {shoe.originalPrice && (
                      <span className="text-[10px] text-neutral-400 line-through font-semibold">
                        Rs. {shoe.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Move to cart CTA */}
                <div className="pt-4 mt-auto">
                  {shoe.inStock ? (
                    <button
                      onClick={() => handleMoveToCart(shoe)}
                      className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Cart</span>
                    </button>
                  ) : (
                    <div className="w-full text-center py-2.5 bg-neutral-100 text-neutral-400 text-[10px] font-bold uppercase tracking-widest border border-neutral-150">
                      Out of stock
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

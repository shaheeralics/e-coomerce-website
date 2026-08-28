'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Shoe } from '@/types';

interface WishlistContextType {
  wishlistItems: Shoe[];
  toggleWishlist: (shoe: Shoe) => void;
  isInWishlist: (id: string) => boolean;
  removeFromWishlist: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Shoe[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('velocity_wishlist');
      if (stored) {
        setWishlistItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load wishlist from localStorage:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('velocity_wishlist', JSON.stringify(wishlistItems));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage:', e);
    }
  }, [wishlistItems, isHydrated]);

  const toggleWishlist = (shoe: Shoe) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === shoe.id);
      if (exists) {
        return prev.filter((item) => item.id !== shoe.id);
      }
      return [...prev, shoe];
    });
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some((item) => item.id === id);
  };

  const removeFromWishlist = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
